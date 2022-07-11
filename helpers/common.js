export function makeRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function changeTimeZone(date, timeZone) {
  if (typeof date === "string") {
    return new Date(
      new Date(date).toLocaleString("en-US", {
        timeZone,
      })
    );
  }

  return new Date(
    date.toLocaleString("en-US", {
      timeZone,
    })
  );
}

export const getCurrentTime = () => {
  var today = new Date()
  var hh = today.getHours()
  let am_or_pm = "am"
  var mm = today.getMinutes()
  var ss = today.getSeconds()

  if (hh > 12){
      hh = hh - 12
  }

  hh = String(hh).padStart(2, '0')
  mm = String(mm).padStart(2, '0')
  ss = String(ss).padStart(2, '0')

  return {
      fullTime: `${hh}:${mm}:${ss}${am_or_pm}`,
      hourMin: `${hh}:${mm}${am_or_pm}`,
      hour: hh,
      min: mm,
      seconds: ss,
      time: am_or_pm
  }
}


export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Util function to call a function later, and return a Promise
function promiseSetTimeout(fun, time) {
  return new Promise((resolve) =>
    setTimeout(() => [fun, resolve].forEach((x) => x.call()), time)
  );
}

// Used as an await wait function
export function waitForSeconds(time) {
  function tick() {
    const min = Math.floor(time / 60);
    let sec = time - min * 60;

    if (sec < 10) {
      sec = "0" + sec;
    }

    const message = min.toString() + ":" + sec;

    time--;
  }
  const interval = setInterval(tick, 1000);
  return promiseSetTimeout(() => clearInterval(interval), time * 1000);
}

