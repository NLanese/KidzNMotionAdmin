import moment from "moment";

export function parseIndividualDriverReport(weeklyReports) {
  let data = [];
  
  if (!weeklyReports) {
    return [];
  }
  console.log(weeklyReports)

  weeklyReports.map((weeklyReportObject) => {
    data.push({
        date: new Date(weeklyReportObject.createdAt),
        dateString: weeklyReportObject.date,
        delivered: weeklyReportObject.delivered,
        deliveryCompletionRate: weeklyReportObject.deliveryCompletionRate === "1" ? 100 : parseFloat(weeklyReportObject.deliveryCompletionRate)
    })

    return;
  });

  data = data.reverse();

  return data;
}
