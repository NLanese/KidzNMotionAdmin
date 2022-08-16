import axios from "axios";

// Parse a pdf
export const pdfParse = async (fileObject) => {
  const dataForm = new FormData();
  await dataForm.append("file", fileObject);

  return await axios({
    method: "post",
    url: "https://pdftables.com/api?key=jp0nf8bef3rk&format=csv",
    data: dataForm,
  })
    .then(({ data }) => {
      return data;
    })
    .catch(({ response }) => {
      return null;
    });
};


export const CSVToArray = (data, delimiter = ",", omitFirstRow = false) =>
  data
    .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
    .split("\n")
    .map((v) => v.split(delimiter));