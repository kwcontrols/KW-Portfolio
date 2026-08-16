import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const propertyId = process.env.GA4_PROPERTY_ID;
if (!propertyId) throw new Error("GA4_PROPERTY_ID is missing");

const analyticsDataClient = new BetaAnalyticsDataClient();

function metricValue(row: { metricValues?: Array<{ value?: string | null }> | null } | null | undefined, index: number) {
  const value = Number(row?.metricValues?.[index]?.value ?? 0);
  return Number.isFinite(value) ? value : 0;
}
function dimensionValue(row: { dimensionValues?: Array<{ value?: string | null }> | null } | null | undefined, index: number) {
  return row?.dimensionValues?.[index]?.value?.trim() ?? "";
}
function percentage(value: number, total: number) { return total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0; }
function formatGaDate(value: string) { return value.length === 8 ? `${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}` : value; }
function recentUtcDates(days: number) {
  const dates:string[]=[]; const today=new Date();
  for(let offset=days-1;offset>=0;offset-=1){const date=new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate()-offset));dates.push(date.toISOString().slice(0,10));}
  return dates;
}

async function main(){
 const [coreBatch]=await analyticsDataClient.batchRunReports({property:`properties/${propertyId}`,requests:[
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],metrics:[{name:"screenPageViews"},{name:"totalUsers"},{name:"activeUsers"},{name:"sessions"},{name:"userEngagementDuration"},{name:"averageSessionDuration"}]},
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],dimensions:[{name:"country"}],metrics:[{name:"totalUsers"}],orderBys:[{metric:{metricName:"totalUsers"},desc:true}],limit:250},
  {dateRanges:[{startDate:"6daysAgo",endDate:"today"}],dimensions:[{name:"date"}],metrics:[{name:"totalUsers"},{name:"screenPageViews"},{name:"sessions"}],orderBys:[{dimension:{dimensionName:"date"}}]},
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],dimensions:[{name:"pageTitle"},{name:"pagePath"}],metrics:[{name:"screenPageViews"}],orderBys:[{metric:{metricName:"screenPageViews"},desc:true}],limit:8},
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],dimensions:[{name:"sessionDefaultChannelGroup"}],metrics:[{name:"totalUsers"}],orderBys:[{metric:{metricName:"totalUsers"},desc:true}],limit:8},
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],dimensions:[{name:"deviceCategory"}],metrics:[{name:"totalUsers"},{name:"sessions"}],orderBys:[{metric:{metricName:"totalUsers"},desc:true}],limit:10},
 ]});

 const [visitorBatch]=await analyticsDataClient.batchRunReports({property:`properties/${propertyId}`,requests:[
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],dimensions:[{name:"city"},{name:"country"}],metrics:[{name:"totalUsers"},{name:"sessions"}],orderBys:[{metric:{metricName:"totalUsers"},desc:true}],limit:20},
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],dimensions:[{name:"deviceCategory"},{name:"browser"},{name:"operatingSystem"}],metrics:[{name:"totalUsers"},{name:"sessions"}],orderBys:[{metric:{metricName:"totalUsers"},desc:true}],limit:20},
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],dimensions:[{name:"newVsReturning"}],metrics:[{name:"totalUsers"}],orderBys:[{metric:{metricName:"totalUsers"},desc:true}],limit:5},
  {dateRanges:[{startDate:"30daysAgo",endDate:"today"}],dimensions:[{name:"date"},{name:"city"},{name:"country"},{name:"deviceCategory"},{name:"browser"},{name:"operatingSystem"},{name:"landingPage"}],metrics:[{name:"sessions"},{name:"screenPageViews"},{name:"averageSessionDuration"},{name:"activeUsers"}],orderBys:[{dimension:{dimensionName:"date"},desc:true},{metric:{metricName:"sessions"},desc:true}],limit:250},
 ]});

 let realtimeRows:any[]=[];
 try{
  const [realtime]=await analyticsDataClient.runRealtimeReport({property:`properties/${propertyId}`,dimensions:[{name:"city"},{name:"country"},{name:"deviceCategory"}],metrics:[{name:"activeUsers"}],limit:50});
  realtimeRows=realtime.rows??[];
 }catch(error){console.warn("Realtime GA4 query unavailable; continuing with processed reports.",error);}

 const [summaryReport,countryReport,trendsReport,pagesReport,sourcesReport,deviceSummaryReport]=coreBatch.reports??[];
 const [citiesReport,devicesReport,visitorTypeReport,activityReport]=visitorBatch.reports??[];
 const summaryRow=summaryReport?.rows?.[0];
 const pageViews=metricValue(summaryRow,0),totalVisitors=metricValue(summaryRow,1),activeVisitors=metricValue(summaryRow,2),sessions=metricValue(summaryRow,3),engagementDuration=metricValue(summaryRow,4),averageSessionDuration=metricValue(summaryRow,5);
 const averageEngagementTime=activeVisitors>0?Number((engagementDuration/activeVisitors).toFixed(1)):0;
 const sessionsPerActiveUser=activeVisitors>0?Number((sessions/activeVisitors).toFixed(2)):0;

 const countryRows=(countryReport?.rows??[]).map(row=>({name:dimensionValue(row,0),users:metricValue(row,0)})).filter(i=>i.name&&i.name!=="(not set)"&&i.users>0);
 const countryUserTotal=countryRows.reduce((s,i)=>s+i.users,0); const countries=countryRows.slice(0,10).map(i=>({...i,percentage:percentage(i.users,countryUserTotal)}));
 const trendRows=new Map((trendsReport?.rows??[]).map(row=>[formatGaDate(dimensionValue(row,0)),{users:metricValue(row,0),pageViews:metricValue(row,1),sessions:metricValue(row,2)}]));
 const visitorTrends=recentUtcDates(7).map(date=>({date,users:trendRows.get(date)?.users??0,pageViews:trendRows.get(date)?.pageViews??0,sessions:trendRows.get(date)?.sessions??0}));
 const topPages=(pagesReport?.rows??[]).map(row=>{const p=dimensionValue(row,1)||"/",t=dimensionValue(row,0);return{title:t&&t!=="(not set)"?t:p,path:p,views:metricValue(row,0)}});
 const rawSources=(sourcesReport?.rows??[]).map(row=>({source:dimensionValue(row,0)||"Unassigned",users:metricValue(row,0)})).filter(i=>i.users>0); const sourceUserTotal=rawSources.reduce((s,i)=>s+i.users,0); const trafficSources=rawSources.map(i=>({...i,percentage:percentage(i.users,sourceUserTotal)}));
 const deviceSummary=(deviceSummaryReport?.rows??[]).map(row=>({category:dimensionValue(row,0)||"unknown",users:metricValue(row,0),sessions:metricValue(row,1)})).filter(i=>i.users>0||i.sessions>0);
 const cities=(citiesReport?.rows??[]).map(row=>({city:dimensionValue(row,0),country:dimensionValue(row,1),users:metricValue(row,0),sessions:metricValue(row,1)})).filter(i=>i.city&&i.city!=="(not set)"&&i.users>0);
 const devices=(devicesReport?.rows??[]).map(row=>({category:dimensionValue(row,0)||"Unknown",browser:dimensionValue(row,1)||"Unknown",operatingSystem:dimensionValue(row,2)||"Unknown",users:metricValue(row,0),sessions:metricValue(row,1)})).filter(i=>i.users>0);
 const rawVisitorTypes=(visitorTypeReport?.rows??[]).map(row=>({type:dimensionValue(row,0)||"unknown",users:metricValue(row,0)})).filter(i=>i.users>0); const visitorTypeTotal=rawVisitorTypes.reduce((s,i)=>s+i.users,0); const visitorTypes=rawVisitorTypes.map(i=>({...i,percentage:percentage(i.users,visitorTypeTotal)}));
 const activityLog=(activityReport?.rows??[]).map(row=>({date:formatGaDate(dimensionValue(row,0)),city:dimensionValue(row,1)||"Unknown",country:dimensionValue(row,2)||"Unknown",device:dimensionValue(row,3)||"Unknown",browser:dimensionValue(row,4)||"Unknown",operatingSystem:dimensionValue(row,5)||"Unknown",landingPage:dimensionValue(row,6)||"/",sessions:metricValue(row,0),pageViews:metricValue(row,1),averageSessionDuration:Number(metricValue(row,2).toFixed(1)),activeUsers:metricValue(row,3)})).filter(i=>i.sessions>0||i.pageViews>0);
 const realtimeVisitors=realtimeRows.map(row=>({city:dimensionValue(row,0)||"Unknown",country:dimensionValue(row,1)||"Unknown",device:dimensionValue(row,2)||"Unknown",activeUsers:metricValue(row,0)})).filter(i=>i.activeUsers>0);
 const realtimeActiveUsers=realtimeVisitors.reduce((s,i)=>s+i.activeUsers,0);

 const analytics={updatedAt:new Date().toISOString(),period:"last30days",pageViews,totalVisitors,activeVisitors,sessions,averageEngagementTime,averageSessionDuration:Number(averageSessionDuration.toFixed(1)),sessionsPerActiveUser,countriesReached:countryRows.length,countries,cities,devices,deviceSummary,visitorTypes,visitorTrends,topPages,trafficSources,activityLog,realtimeActiveUsers,realtimeVisitors};
 const outputDirectory=path.join(process.cwd(),"data"),outputPath=path.join(outputDirectory,"analytics.json"); await mkdir(outputDirectory,{recursive:true}); await writeFile(outputPath,JSON.stringify(analytics,null,2),"utf8"); console.log(`Analytics written to ${outputPath}`); console.log(analytics);
}
main().catch(error=>{console.error(error);process.exit(1)});
