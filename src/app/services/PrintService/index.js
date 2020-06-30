import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import utils from "../../helper/utils";
import CompanyService from "../CompanyService";
import moment from "moment";
import Variables from "../../../variables";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// pdfMake.fonts = {
//   Roboto: {
//     normal: "Roboto-Regular.ttf",
//     bold: "Roboto-Medium.ttf",
//     italics: "Roboto-Italic.ttf",
//     bolditalics: "Roboto-Italic.ttf",
//   },
//   Trebuc: {
//     normal: "trebuc.ttf",
//     bold: "trebuc.ttf",
//     italics: "trebuc.ttf",
//     bolditalics: "Trebuchet-MS-Italic",
//   },
// };

const printInvoice = async (data, totalAmounts) => {
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  var bodys = [
    [
      { text: "sn", style: "hd" },
      { text: "Item", style: "hd" },
      { text: "Qty", style: "hd" },
      { text: "Price", style: "hd" },
      { text: "Total", style: "hd" },
      { text: "Vat", style: "hd" },
      { text: "Grand", style: "hd" },
    ],
  ];
  data.data.forEach((element, index) => {
    bodys.push([
      { text: index + 1, alignment: "left" },
      { text: element.item, alignment: "left" },
      { text: element.qty, alignment: "left" },
      { text: utils.toFixNumber(element.price), alignment: "left" },
      { text: utils.toFixNumber(element.total), alignment: "left" },
      { text: utils.toFixNumber(element.vat), alignment: "left" },
      { text: utils.toFixNumber(element.grand), alignment: "left" },
    ]);
  });
  var docDefinition = {
    // header:{text:'IBAW', style:'header'},
    // pageOrientation: 'landscape',
    pageMargins: [20, 120, 20, 160],
    header: {
      margin: 20,
      columns: [
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                {
                  table: {
                    body: [
                      [
                        { text: "Pan : ", alignment: "right" },
                        { text: company.pan, alignment: "right" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        { text: company.name, alignment: "center" },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        { text: company.address, alignment: "center" },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: company.telephone, alignment: "center" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
                { text: data.title, alignment: "right" },
              ],
              [
                {
                  table: {
                    widths: ["*", "*"],
                    body: [
                      [
                        {
                          text:
                            data.title === "INVOICE"
                              ? "Customer : "
                              : "Supplier : ",
                          alignment: "left",
                        },
                        { text: data.user, alignment: "left" },
                      ],
                      [
                        { text: "Address : ", alignment: "left" },
                        { text: data.address, alignment: "left" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
                {},
                {
                  table: {
                    widths: ["*", "*"],
                    body: [
                      [
                        { text: "No : ", alignment: "right" },
                        { text: data.inv_no, alignment: "right" },
                      ],
                      [
                        { text: "Date : ", alignment: "right" },
                        { text: data.date, alignment: "right" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    footer: {
      margin: 20,
      columns: [
        {
          table: {
            widths: [30, 180, 50, 50, 50, 50, 50],
            body: [
              [
                {},
                {},
                {},
                { text: "Total", alignment: "right", margin: [0, 0, 0, 0] },
                {
                  text: utils.toFixNumber(data.total),
                  alignment: "right",
                  margin: [12, 0, 0, 0],
                },
                {
                  text: utils.toFixNumber(data.vat),
                  alignment: "right",
                  margin: [0, 0, 0, 0],
                },
                {
                  text: utils.toFixNumber(data.grand),
                  alignment: "right",
                  margin: [0, 0, 0, 0],
                },
              ],
              [
                {
                  table: {
                    body: [
                      [
                        [
                          { text: "E . & . O.E : ", margin: [0, 1, 0, 0] },
                          { text: "Buyers Sign : ", margin: [0, 1, 0, 0] },
                          { text: "Name : ", margin: [0, 1, 0, 0] },
                        ],

                        {
                          text: "For Bagale Traders : ",
                          margin: [250, 30, 0, 0],
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                  colSpan: 7,
                  margin: [0, 48, 0, 0],
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },

    content: [
      {
        table: {
          style: "",
          headerRows: 1,
          footerRows: 1,
          widths: [30, 180, 50, 50, 50, 50, 50],
          body: bodys,
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      footer: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      hd: {
        color: "#4F90BB",
        fillColor: "#DCE9F1",
        alignment: "left",
      },
      no_border: {
        border: "1px",
      },
    },
  };
  var win = window.open("", "_blank");
  pdfMake.createPdf(docDefinition).open({}, win,);
  setTimeout(
    function() {
        window.location.reload();
    }
    .bind(this),
    3000
);
};

//--------------------------------------------------------------------------------*****************************------------------------------------------//
const printBankStatement = async (data, Print, dateStr, bank, username) => {
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  var bodys = [
    [
      { text: "sn", style: "hd" },
      { text: "Date Bs", style: "hd" },
      { text: "Date Ad", style: "hd" },
      { text: "Trans No.", style: "hd" },
      { text: "Remark", style: "hd" },
      { text: "Debit", style: "hd" },
      { text: "Credit", style: "hd" },
      { text: "Balance", style: "hd" },
    ],
  ];
  data.forEach((element, index) => {
    bodys.push([
      { text: index + 1, alignment: "center", fontSize: "10" },
      {
        text: moment(element.date).format("MM-DD-YYYY"),
        alignment: "left",
      },
      {
        text: moment(element.date).format("MM-DD-YYYY"),
        alignment: "left",
      },
      { text: element.trans_id, alignment: "left" },
      { text: element.remark, alignment: "left" },
      {
        text: element.debit === 0 ? "-" : element.debit,
        alignment: "left",
      },
      {
        text: element.credit === 0 ? "-" : element.credit,
        alignment: "left",
      },
      { text: element.balance, alignment: "left" },
    ]);
  });
  var docDefinition = {
    // header:{text:'IBAW', style:'header'},
    // pageOrientation: 'landscape',
    //pageSize: "A5",
    pageMargins: [10, 110, 10, 60],
    defaultStyle: {
      fontSize: 10,
    },
    header: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        {
                          text:
                            company.name === undefined
                              ? "Company Name Text"
                              : company.name,
                          alignment: "center",
                          fontSize: "11",
                        },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        {
                          text:
                            company.address === undefined
                              ? "Company Address text"
                              : company.address,
                          alignment: "center",
                          fontSize: "10",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        {
                          text:
                            company.telephone === undefined
                              ? "Company telephone text"
                              : company.telephone,
                          alignment: "center",
                          fontSize: "10",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: bank, alignment: "center", fontSize: "10" },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: dateStr, alignment: "center", fontSize: "10" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    content: [
      {
        table: {
          style: "no_border",
          headerRows: 1,
          widths: ["auto", "*", "*", "auto", "auto", "*", "*", "*"],
          body: bodys,
        },
        layout: "headerLineOnly",
      },
    ],
    footer: {
      columns: [
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: "Created By ",
                          alignment: "left",
                          fontSize: 10,
                        },
                      ],
                      [
                        {
                          text: username,
                          alignment: "left",
                          color: "#706c6c",
                          fontSize: 10,
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
                {},
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: "Verified By ",
                          alignment: "right",
                          fontSize: 10,
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      hd: {
        color: "#4F90BB",
        fillColor: "#DCE9F1",
        alignment: "left",
        margin: [5, 5, 5, 5],
      },
      header_content: {
        margin: [0, 0, 0, 0],
      },
      no_border: {
        border: "0px",
      },
    },
  };
  if (Print === true) {
    var win = window.open("", "_blank");
    pdfMake.createPdf(docDefinition).print({}, win);
  } else pdfMake.createPdf(docDefinition).download();
};

//--------------------------------------------------------------------------------*****************************------------------------------------------//
const printDaybook = async (data, Print, dateStr, title) => {
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  var bodys = [
    [
      { text: "sn", style: "hd" },
      { text: "Date", style: "hd" },
      { text: "Trans No.", style: "hd" },
      { text: "Ledger", style: "hd" },
      { text: "Debit", style: "hd" },
      { text: "Credit", style: "hd" },
      { text: "Remark", style: "hd" },
    ],
  ];
  data.forEach((element, index) => {
    bodys.push([
      { text: element.date === "" ? "" : index + 1, alignment: "center" },
      {
        text:
          element.date === "" ? "" : moment(element.date).format("MM-DD-YYYY"),
        alignment: "left",
      },
      { text: element.trans_Id, alignment: "left" },
      { text: element.ledger_name, alignment: "left" },
      { text: element.debit || "-", alignment: "left" },
      { text: element.credit || "-", alignment: "left" },
      { text: element.remarks, alignment: "left" },
    ]);
  });
  var docDefinition = {
    // header:{text:'IBAW', style:'header'},
    // pageOrientation: 'landscape',
    pageMargins: [40, 120, 40, 60],
    header: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        {
                          text:
                            company.name === undefined
                              ? "Company Name Text"
                              : company.name,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        {
                          text:
                            company.address === undefined
                              ? "Company Address text"
                              : company.address,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        {
                          text:
                            company.telephone === undefined
                              ? "Company telephone text"
                              : company.telephone,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: title, alignment: "center" },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: dateStr, alignment: "center" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    content: [
      {
        table: {
          style: "no_border",
          headerRows: 1,
          widths: ["auto", 100, "auto", "auto", "auto", "auto", "auto"],
          body: bodys,
        },
        layout: "headerLineOnly",
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      hd: {
        color: "#4F90BB",
        fillColor: "#DCE9F1",
        alignment: "left",
      },
      header_content: {
        margin: [0, 0, 0, 0],
      },
      no_border: {
        border: "0px",
      },
    },
  };

  if (Print === true) {
    var win = window.open("", "_blank");
    pdfMake.createPdf(docDefinition).print({}, win);
  } else pdfMake.createPdf(docDefinition).download();
};
//--------------------------------------------------------------------------------*****************************------------------------------------------//
const printCharKhata = async (data, Print, dateStr, title) => {
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  var bodys = [
    [
      { text: "sn", style: "hd" },
      { text: "Date", style: "hd" },
      { text: "Voucher No.", style: "hd" },
      { text: "Type", style: "hd" },
      { text: "Leader Name", style: "hd" },
      { text: "Debit", style: "hd" },
      { text: "Credit", style: "hd" },
      { text: "Balance", style: "hd" },
    ],
  ];
  data.forEach((element, index) => {
    bodys.push([
      { text: element.date === "" ? "" : index + 1, alignment: "center" },
      {
        text:
          element.date === "" ? "" : moment(element.date).format("MM-DD-YYYY"),
        alignment: "left",
      },
      { text: element.vouc_No, alignment: "left" },
      { text: element.tran_type, alignment: "left" },
      { text: element.ledger_name, alignment: "left" },
      { text: element.debit || "-", alignment: "left" },
      { text: element.credit || "-", alignment: "left" },
      { text: element.balance || "-", alignment: "left" },
    ]);
  });
  var docDefinition = {
    // header:{text:'IBAW', style:'header'},
    // pageOrientation: 'landscape',
    pageMargins: [40, 120, 40, 60],
    header: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        {
                          text:
                            company.name === undefined
                              ? "Company Name Text"
                              : company.name,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        {
                          text:
                            company.address === undefined
                              ? "Company Address text"
                              : company.address,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        {
                          text:
                            company.telephone === undefined
                              ? "Company telephone text"
                              : company.telephone,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: title, alignment: "center" },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: dateStr, alignment: "center" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    content: [
      {
        table: {
          style: "no_border",
          headerRows: 1,
          widths: ["auto", 100, "auto", "auto", "auto", "auto", "auto","auto"],
          body: bodys,
        },
        layout: "headerLineOnly",
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      hd: {
        color: "#4F90BB",
        fillColor: "#DCE9F1",
        alignment: "left",
      },
      header_content: {
        margin: [0, 0, 0, 0],
      },
      no_border: {
        border: "0px",
      },
    },
  };

  if (Print === true) {
    var win = window.open("", "_blank");
    pdfMake.createPdf(docDefinition).print({}, win);
  } else pdfMake.createPdf(docDefinition).download();
};
//--------------------------------------------------------------------------------*****************************------------------------------------------//
const printStatment = async (data, Print, dateStr, title) => {
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  var bodys = [
    [
      { text: "sn", style: "hd" },
      { text: "Date", style: "hd" },
      { text: "Invoice No.", style: "hd" },
      { text: "Details", style: "hd" },
      { text: "", style: "hd" }, 
      { text: "Debit", style: "hd" },
      { text: "Credit", style: "hd" },
      { text: "Balance", style: "hd" },
    ],
  ];
  data.forEach((element, index) => {
    bodys.push([
      { text: element.date === "" ? "" : index + 1, alignment: "center" },
      {
        text:
          element.date === "" ? "" : moment(element.date).format("MM-DD-YYYY"),
        alignment: "left",
      },
      { text: element.vouc_No, alignment: "left" },
      { text: element.tran_type + element.remarks, alignment: "left" },
      { text: element.ledger_name, alignment: "left" },
      { text: element.debit || "-", alignment: "left" },
      { text: element.credit || "-", alignment: "left" },
      { text: element.balance || "-", alignment: "left" },
    ]);
  });
  var docDefinition = {
    // header:{text:'IBAW', style:'header'},
    // pageOrientation: 'landscape',
    pageMargins: [40, 120, 40, 60],
    header: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        {
                          text:
                            company.name === undefined
                              ? "Company Name Text"
                              : company.name,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        {
                          text:
                            company.address === undefined
                              ? "Company Address text"
                              : company.address,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        {
                          text:
                            company.telephone === undefined
                              ? "Company telephone text"
                              : company.telephone,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: title, alignment: "center" },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: dateStr, alignment: "center" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    content: [
      {
        table: {
          style: "no_border",
          headerRows: 1,
          widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto","auto"],
          body: bodys,
        },
        layout: "headerLineOnly",
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      hd: {
        color: "#4F90BB",
        fillColor: "#DCE9F1",
        alignment: "left",
      },
      header_content: {
        margin: [0, 0, 0, 0],
      },
      no_border: {
        border: "0px",
      },
    },
  };

  if (Print === true) {
    var win = window.open("", "_blank");
    pdfMake.createPdf(docDefinition).print({}, win);
  } else pdfMake.createPdf(docDefinition).download();
};
//--------------------------------------------------------------------------------*****************************------------------------------------------//
const printAccountpayable = async (data, Print, title) => {
  console.log("printAccountpayable -> data", data)
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  var bodys = [
    [
      { text: "sn", style: "hd" },
      { text: "Party Name", style: "hd" },
      { text: "Balance", style: "hd" },
      { text: "Mobile", style: "hd" },
      { text: "", style: "hd" },
      { text: "Total", style: "hd" },
    ],
  ];
  data.forEach((element, index) => {
    bodys.push([
      { text: element.date === "" ? "" : index + 1},
      { text: element.name, alignment: "left" },
      { text: element.balance, alignment: "left" },
      { text: element.mobile, alignment: "left" },
      { text: element.ledger_name, alignment: "left" },
      { text: element.total || "-", alignment: "left" },
    ]);
  });
  var docDefinition = {
    // header:{text:'IBAW', style:'header'},
    // pageOrientation: 'landscape',
    pageMargins: [40, 120, 40, 60],
    header: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        {
                          text:
                            company.name === undefined
                              ? "Company Name Text"
                              : company.name,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        {
                          text:
                            company.address === undefined
                              ? "Company Address text"
                              : company.address,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        {
                          text:
                            company.telephone === undefined
                              ? "Company telephone text"
                              : company.telephone,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: title, alignment: "center" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    content: [
      {
        table: {
          style: "no_border",
          headerRows: 1,
          widths: [50, 75,100, 75, 75,75],
          body: bodys,
        },
        layout: "headerLineOnly",
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      hd: {
        color: "#4F90BB",
        fillColor: "#DCE9F1",
        alignment: "left",
      },
      header_content: {
        margin: [0, 0, 0, 0],
      },
      no_border: {
        border: "0px",
      },
    },
  };

  if (Print === true) {
    var win = window.open("", "_blank");
    pdfMake.createPdf(docDefinition).print({}, win);
  } else pdfMake.createPdf(docDefinition).download();
};
//--------------------------------------------------------------------------------*****************************------------------------------------------//

const printVoucher = async (data, Voucher, username, date) => {
  //debugger;
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  var bodys = [
    [
      { text: "Sn.", style: "hd" },
      { text: "Ledger_name", style: "hd" },
      { text: "Debit", style: "hd" },
      { text: "Credit", style: "hd" },
      { text: "Naration", style: "hd" },
      // { text: "Remarks", style: "hd" },
    ],
  ];
  data.forEach((element, index) => {
    bodys.push([
      {
        text: element.ledgerName === "Total" ? "" : index + 1,
        alignment: "left",
        fontSize: 10,
      },
      { text: element.ledgerName, alignment: "left", fontSize: 10 },
      {
        text: utils.toFixNumber(element.debit),
        alignment: "left",
        fontSize: 10,
      },
      {
        text: utils.toFixNumber(element.credit),
        alignment: "left",
        fontSize: 10,
      },
      {
        text: element.naration === undefined ? "" : element.naration,
        alignment: "left",
        fontSize: 10,
      },
      // {
      //   text: element.naration === undefined ? "" : element.remarks,
      //   alignment: "left",
      // },
    ]);
  });
  var docDefinition = {
    pageMargins: [10, 110, 10, 60],
    // pageSize: {
    //   width: "auto",
    //   height: 595,
    // },
    pageSize: "A5",
    // defaultStyle: {
    //   font: "Trebuc",
    // },
    // by default we use portrait, you can change it to landscape if you wish
    //pageOrientation: "landscape",
    // pageSize: {
    //   height: 148,
    //   width: 210,
    // },
    header: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        {
                          text:
                            company.name === undefined
                              ? "Company Name Text"
                              : company.name,
                          alignment: "center",
                          fontSize: 11,
                        },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        {
                          text:
                            company.address === undefined
                              ? "Company Address text"
                              : company.address,
                          alignment: "center",
                          fontSize: 10,
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        {
                          text:
                            company.telephone === undefined
                              ? "Company telephone text"
                              : company.telephone,
                          alignment: "center",
                          fontSize: 10,
                        },
                      ],
                      [
                        {
                          table: {
                            widths: ["*", "*", "*"],
                            body: [
                              [
                                {
                                  table: {
                                    widths: [28, "*"],
                                    body: [
                                      [
                                        {
                                          text: "Date :",
                                          alignment: "left",
                                          fontSize: 10,
                                        },
                                        {
                                          text: date,
                                          alignment: "left",
                                          fontSize: 10,
                                        },
                                      ],
                                    ],
                                  },
                                  layout: "noBorders",
                                },
                                {},
                                {
                                  table: {
                                    widths: [28, "*"],
                                    body: [
                                      [
                                        {
                                          text: "Type :",
                                          alignment: "right",
                                          fontSize: 10,
                                        },
                                        {
                                          text: "",
                                          alignment: "right",
                                          fontSize: 10,
                                        },
                                      ],
                                    ],
                                  },
                                  layout: "noBorders",
                                },
                              ],
                            ],
                          },
                          layout: "noBorders",
                        },
                      ],
                      [
                        // {
                        //   text: "Voucher No :",
                        //   alignment: "left",
                        //   fontSize: 10,
                        // },
                        {
                          text: "Voucher No : " + Voucher,
                          alignment: "left",
                          fontSize: 10,
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    footer: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: "Created By ",
                          alignment: "left",
                          fontSize: 10,
                        },
                      ],
                      [
                        {
                          text: username,
                          alignment: "left",
                          color: "#706c6c",
                          fontSize: 10,
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
                {},
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: "Verified By ",
                          alignment: "right",
                          fontSize: 10,
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    content: [
      {
        table: {
          style: "no_border",
          headerRows: 1,
          widths: [10, "*", 50, 50, "*"],
          body: bodys,
        },
        layout: "headerLineOnly",
      },
      {
        columns: [
          { text: "Remark", width: 50, style: "remark", bold: true },
          { text: data[0].remarks, style: "remark" },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      hd: {
        color: "#4F90BB",
        fillColor: "#DCE9F1",
        alignment: "left",
        fontSize: 10,
      },
      header_content: {
        margin: [100, 0, 0, 0],
      },
      no_border: {
        border: "0px",
      },
      remark: {
        fontSize: 10,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
    },
  };
  var win = window.open("", "_blank");
  pdfMake.createPdf(docDefinition).print({}, win);
};

const printAllVoucher = async (data, Print, username, date) => {
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  var bodys = [
    [
      { text: "Sn.", style: "hd" },
      { text: "Date", style: "hd" },
      { text: "Voucher No.", style: "hd" },
      { text: "Remarks", style: "hd" },
      { text: "UserName", style: "hd" },
      { text: "Amount", style: "hd" },
    ],
  ];
  data.forEach((element, index) => {
    bodys.push([
      {
        text: element.userName === "Total" ? "" : index + 1,
        alignment: "left",
        fontSize: 10,
      },
      {
        text: element.userName === "Total" ? "" : element.date,
        alignment: "left",
        fontSize: 10,
      },
      {
        text: element.userName === "Total" ? "" : element.vouc_No,
        alignment: "left",
        fontSize: 10,
      },
      {
        text: element.userName === "Total" ? "" : element.remarks,
        alignment: "left",
        fontSize: 10,
      },
      {
        text: element.userName,
        alignment: "left",
        fontSize: 10,
      },
      {
        text: utils.toFixNumber(element.debit),
        alignment: "left",
        fontSize: 10,
      },
    ]);
  });
  var docDefinition = {
    pageMargins: [10, 110, 10, 60],
    // pageSize: {
    //   width: "auto",
    //   height: 595,
    // },
    pageSize: "A5",
    // defaultStyle: {
    //   font: "Trebuc",
    // },
    // by default we use portrait, you can change it to landscape if you wish
    //pageOrientation: "landscape",
    // pageSize: {
    //   height: 148,
    //   width: 210,
    // },
    header: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        {
                          text:
                            company.name === undefined
                              ? "Company Name Text"
                              : company.name,
                          alignment: "center",
                          fontSize: 11,
                        },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        {
                          text:
                            company.address === undefined
                              ? "Company Address text"
                              : company.address,
                          alignment: "center",
                          fontSize: 10,
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        {
                          text:
                            company.telephone === undefined
                              ? "Company telephone text"
                              : company.telephone,
                          alignment: "center",
                          fontSize: 10,
                        },
                      ],
                      [
                        {
                          table: {
                            widths: ["*"],
                            body: [
                              [
                                {
                                  table: {
                                    widths: [28, "*"],
                                    body: [
                                      [
                                        {
                                          text: "Date :",
                                          alignment: "left",
                                          fontSize: 10,
                                        },
                                        {
                                          text: date,
                                          alignment: "left",
                                          fontSize: 10,
                                        },
                                      ],
                                    ],
                                  },
                                  layout: "noBorders",
                                },
                              ],
                            ],
                          },
                          layout: "noBorders",
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    footer: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: "Created By ",
                          alignment: "left",
                          fontSize: 10,
                        },
                      ],
                      [
                        {
                          text: username,
                          alignment: "left",
                          color: "#706c6c",
                          fontSize: 10,
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
                {},
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: "Verified By ",
                          alignment: "right",
                          fontSize: 10,
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    content: [
      {
        table: {
          style: "no_border",
          headerRows: 1,
          widths: [10, 60, 50, "*", "*", 50],
          body: bodys,
        },
        layout: "headerLineOnly",
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "left",
        color: "#4F90BB",
      },
      hd: {
        color: "#4F90BB",
        fillColor: "#DCE9F1",
        alignment: "left",
        fontSize: 10,
      },
      header_content: {
        margin: [100, 0, 0, 0],
      },
      no_border: {
        border: "0px",
      },
      remark: {
        fontSize: 10,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
    },
  };

  if (Print === true) {
    var win = window.open("", "_blank");
    pdfMake.createPdf(docDefinition).print({}, win);
  } else pdfMake.createPdf(docDefinition).download();
};

const excelBalanceData = (data) => {
  if (!Object.keys(data).length) return [];
  if (!data) return [];
  console.log(data);
  const getSpace = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) result += "\t";
    return result;
  };
  const getChildren = (data, length = 0) => {
    if (data.children) {
      bodys.push({
        title: getSpace(length) + data.title,
        debit: "",
        credit: "",
      });
    } else if (data.type === 100 || data.type === 400) {
      bodys.push({
        title: getSpace(length) + data.title,
        debit: getDifference(data.debit, data.credit),
        credit: "",
      });
    } else {
      bodys.push({
        title: getSpace(length) + data.title,
        debit: "",
        credit: getDifference(data.credit, data.debit),
      });
    }
    data.children &&
      data.children.map((element) => getChildren(element, length + 1));
  };
  const getDifference = (debit, credit) => {
    return debit - credit < 0 ? `(${credit - debit})` : debit - credit;
  };

  let keys = [100, 400, 200, 300];

  var bodys = [];
  keys.map((key) => getChildren(data[Variables.mastGroup[key].label]));
  return bodys;
};

const printBalanceReport = async (title, data) => {
  const companys = await CompanyService.getCompanys();
  const company = companys.length ? companys[0] : {};
  const getSpace = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) result += "\t";
    return result;
  };
  const getChildren = (data, length = 0) => {
    if (data.children) {
      bodys.push([
        {
          text: getSpace(length) + data.title,
          style: [`margin-${length}`, data.isBold ? "bold" : ""],
        },
        { text: "", style: "debit" },
        { text: "", style: "credit" },
      ]);
    } else if (data.type === 100 || data.type === 400) {
      bodys.push([
        {
          text: getSpace(length) + data.title,
          style: [`margin-${length}`, data.isBold ? "bold" : ""],
        },
        { text: getDifference(data.debit, data.credit), style: "debit" },
        { text: "-", style: "credit" },
      ]);
    } else {
      bodys.push([
        {
          text: getSpace(length) + data.title,
          style: [`margin-${length}`, data.isBold ? "bold" : ""],
        },
        { text: "-", style: "debit" },
        { text: getDifference(data.credit, data.debit), style: "credit" },
      ]);
    }
    data.children &&
      data.children.map((element) => getChildren(element, length + 1));
  };
  const getDifference = (debit, credit) => {
    return debit - credit < 0 ? `(${credit - debit})` : debit - credit;
  };

  let keys = [100, 400, 200, 300];

  var bodys = [];
  keys.map((key) => getChildren(data[Variables.mastGroup[key].label]));
  console.log(bodys);
  // data.forEach((element, index) => {
  //   bodys.push([
  //     { text: element.ledgerName === 'Total' ? '' : index + 1, alignment: 'left' },
  //     { text: element.ledgerName, alignment: 'left' },
  //     { text: utils.toFixNumber(element.debit), alignment: 'left' },
  //     { text: utils.toFixNumber(element.credit), alignment: 'left' },
  //     { text: element.naration === undefined ? '' : element.naration, alignment: 'left' },
  //     { text: element.naration === undefined ? '' : element.remarks, alignment: 'left' },
  //   ]);
  // });
  const style = {
    decoration: { decoration: "underline" },
    bold: { bold: true },
  };
  for (let i = 0; i < 10; i++) {
    style[`margin-${i}`] = { margin: [10 * i, 5, 5, 5] };
  }

  var docDefinition = {
    pageMargins: [10, 110, 10, 60],
    header: {
      margin: 8,
      columns: [
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                {},
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        // { text: 'Company : ', alignment: 'right' },
                        {
                          text:
                            company.name === undefined
                              ? "Company Name Text"
                              : company.name,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Address : ', alignment: 'right' },
                        {
                          text:
                            company.address === undefined
                              ? "Company Address text"
                              : company.address,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        {
                          text:
                            company.telephone === undefined
                              ? "Company telephone text"
                              : company.telephone,
                          alignment: "center",
                        },
                      ],
                      [
                        // { text: 'Telephone : ', alignment: 'right' },
                        { text: title, alignment: "center" },
                      ],
                      [
                        {
                          text: moment().format("MM-DD-YYYY"),
                          alignment: "center",
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },
    content: {
      table: {
        style: "no_border",
        headerRows: 0,
        widths: ["*", 50, 50],
        body: bodys,
      },
      layout: "lightHorizontalLines",
    },
    styles: style,
  };
  var win = window.open("", "_blank");
  pdfMake.createPdf(docDefinition).print({}, win);
};

export default {
  printInvoice,
  printBankStatement,
  printDaybook,
  printCharKhata,
  printVoucher,
  printBalanceReport,
  excelBalanceData,
  printAllVoucher,
  printAccountpayable,
  printStatment
};
