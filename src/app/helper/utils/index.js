import moment from "moment";
const toFixNumber = (value, float = 2) => {
  let number = Number(value);
  return number.toFixed(float);
};
const getDateRange = (range) => {
  let from, to, now;
  now = moment();
  switch (range) {
    case "All dates":
      from = to = "";
      break;
    case "Custom":
      from = moment(now.format("YYYY-MM-DD"));
      to = moment(now.format("YYYY-MM-DD")).add(1, "days");
      break;
    case "Today":
      from = moment(now.format("YYYY-MM-DD"));
      //to = moment(now.format('YYYY-MM-DD')).add(1, 'days');
      to = moment(now.format("YYYY-MM-DD"));
      break;
    case "Yesterday":
      from = moment(now.format("YYYY-MM-DD")).add(-1, "days");
      to = moment(now.format("YYYY-MM-DD"));
      break;
    case "This week":
      from = moment(now.format("YYYY-MM-DD")).set({ day: 0 });
      to = moment(now.format("YYYY-MM-DD")).set({ day: 6 });
      break;
    case "This month":
      from = moment(now.format("YYYY-MM-DD")).set({ date: 1 });
      to = moment(now.format("YYYY-MM-DD"))
        .add(1, "months")
        .date(0);
      break;
    case "This year":
      from = moment(now.format("YYYY-MM-DD")).set({ month: 0, date: 1 });
      to = moment(now.format("YYYY-MM-DD")).set({ month: 11, date: 31 });
      break;
    case "Last week":
      from = moment(now.format("YYYY-MM-DD"))
        .set({ day: 0 })
        .add(-7, "days");
      to = moment(now.format("YYYY-MM-DD"))
        .set({ day: 6 })
        .add(-7, "days");
      break;
    case "Last month":
      from = moment(now.format("YYYY-MM-DD"))
        .add(-1, "months")
        .set({ date: 1 });
      to = moment(now.format("YYYY-MM-DD")).date(0);
      break;
    case "Last year":
      from = moment(now.format("YYYY-MM-DD"))
        .add(-1, "years")
        .set({ month: 0, date: 1 });
      to = moment(now.format("YYYY-MM-DD"))
        .add(-1, "years")
        .set({ month: 11, date: 31 });
      break;
    default:
      from = moment(now.format("YYYY-MM-DD"));
      to = moment(now.format("YYYY-MM-DD")).add(1, "days");
  }
  return { from, to };
};
export default { toFixNumber, getDateRange };
