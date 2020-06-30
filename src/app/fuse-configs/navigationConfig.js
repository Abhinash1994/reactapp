import { AllVoucherPath } from "app/links/commonLinks";
export const navigationConfig = () => {
  return [
    [
      {
        id: "dashboard-component",
        title: "Dashboard",
        type: "item",
        icon: "dashboard",
        url: "/dashboard",
      },
      {
        id: "banking-component",
        title: "Banking",
        type: "collapse",
        icon: "whatshot",
        url: "/users",
        children: [
          {
            id: "create-bank-page",
            title: "Create Bank",
            type: "item",
            icon: "account_balance",
            url: "/banking/bankManager",
            exact: true,
          },
          {
            id: "bank-deposit-page",
            title: "Bank Deposit",
            type: "item",
            icon: "add_box",
            url: "/banking/bankDeposit",

            exact: true,
          },
          {
            id: "bank-withdraw-page",
            title: "Bank Withdraw",
            type: "item",
            icon: "indeterminate_check_box",
            url: "/banking/bankWithdraw",
            exact: true,
          },
          {
            id: "bank-statement-page",
            title: "Bank Statement",
            type: "item",
            icon: "account_balance_wallet",
            url: "/banking/bankStatement",
            exact: true,
          },
        ],
      },
      {
        id: "accounting-pages",
        title: "Accounting",
        type: "collapse",
        icon: "settings",
        url: "/accounting",
        children: [
          {
            id: "voucher-page",
            title: "Voucher",
            type: "item",
            icon: "card_giftcard",
            url: "/accounting",
            exact: true,
          },
          {
            id: "day-book-page",
            title: "Day Book",
            type: "item",
            icon: "question_answer",
            url: "/daybook",
            exact: true,
          },
          {
            id: "cash-book-page",
            title: "Cash Book",
            type: "item",
            icon: "question_answer",
            url: "/cashbook",
            exact: true,
          },
          {
            id: "all-voucher-page",
            title: "All Voucher",
            type: "item",
            icon: "question_answer",
            url: AllVoucherPath,
            exact: true,
          },
        ],
      },
      {
        id: "sales-page",
        title: "Sales",
        type: "collapse",
        icon: "question_answer",
        url: "/sales",
        children: [
     

       {
        id: "sale-page",
        title: "Invoice",
        type: "item",
        icon: "invoice",
        url: "/sales",
        exact:true,
      },
        {
        id: "challan-page",
        title: "Challan",
        type: "item",
        icon: "sms",
        url: "/challan",
        exact:true,
      },
      ],
    },
      
      {
        id: "purchase-page",
        title: "Purchase",
        type: "item",
        icon: "question_answer",
        url: "/newpurchase",
      },
      {
        id: "projects-manager-page",
        title: "Project",
        type: "item",
        icon: "question_answer",
        url: "/project",
      },

      {
        id: "hr-payroll-page",
        title: "Hr Payroll",
        type: "item",
        icon: "question_answer",
        url: "/payroll",
      },

      {
        id: "budject-page",
        title: "Budget",
        type: "item",
        icon: "attach_money",
        url: "/budgeting",
      },

      {
        id: "sms-page",
        title: "SMS",
        type: "item",
        icon: "sms",
        url: "/sms",
      },
      {
        id: "tax-page",
        title: "Tax",
        type: "item",
        icon: "question_answer",
        url: "/taxsetup",
      },

           {
        id: "inventory-page",
        title: "Inventory",
        type: "collapse",
        icon: "question_answer",
        url: "/inventory",
        children: [
     

       {
        id: "unit-page",
        title: "Unit",
        type: "item",
        icon: "invoice",
        url: "/Unit",
        exact:true,
      },
        {
        id: "godown-page",
        title: "Go Down",
        type: "item",
        icon: "sms",
        url: "/godown",
        exact:true,
      },
         {
        id: "stock-page",
        title: "Stock Transfer",
        type: "item",
        icon: "sms",
        url: "/stocktransfer",
        exact:true,
      },
        {
        id: "qoh-page",
        title: "Quantity On Hand",
        type: "item",
        icon: "sms",
        url: "/qtyonhand",
        exact:true,
      },
      ],
    },
      {
        id: "report-page",
        title: "Report",
        type: "item",
        icon: "question_answer",
        url: "/settings/landing",
      },

           {
        id: "global-setup",
        title: "Global",
        type: "collapse",
        icon: "question_answer",
        url: "/globalsetting",
        children: [
     

       {
        id: "day-page",
        title: "Day Post",
        type: "item",
       
        url: "/daypost",
        exact:true,
      },
        {
        id: "year-page",
        title: "Year End",
        type: "item",
     
        url: "/godown",
        exact:true,
      },
         {
        id: "database-page",
        title: "Database BackUp",
        type: "item",
      
        url: "/databasebackup",
        exact:true,
      },
        {
        id: "license",
        title: "License",
        type: "item",
        url: "/license",
        exact:true,
      },
      ],
    },
    ],
  ];
  // return navigationConfigs
};

//  let data =getData()
// console.log("**************MENU*************"+JSON.stringify(primaryMenu))

// export default navigationConfig;
