const API_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_BASE_API_URL
    : process.env.REACT_APP_PROD_BASE_API_URL;
//const API_URL = "http://localhost:63012";
const Menus = {
  Company: {
    icon: "panorama_fish_eye",
    link: "/company",
  },
  Branch: {
    icon: "panorama_fish_eye",
    link: "/branch",
  },
  "Fiscal Year": {
    icon: "panorama_fish_eye",
    link: "/fiscal",
  },
  "User Role": {
    icon: "panorama_fish_eye",
    link: "/userrole",
  },
  Users: {
    icon: "panorama_fish_eye",
    link: "/users",
  },
  "Role Assignment": {
    icon: "panorama_fish_eye",
    link: "/roleassignment",
  },
  "Product Group": {
    icon: "panorama_fish_eye",
    link: "/productGroup",
  },
  "Product & Service": {
    icon: "panorama_fish_eye",
    link: "/Productservice",
  },
  "User Log": {
    icon: "panorama_fish_eye",
    link: "/userlog",
  },
  "Auto Numbering": {
    icon: "panorama_fish_eye",
    link: "/autoNumbering",
  },
  "Import Data": {
    icon: "panorama_fish_eye",
    link: "/importData",
  },
  "Export Data": {
    icon: "panorama_fish_eye",
    link: "/exprtData",
  },
  Attachment: {
    icon: "panorama_fish_eye",
    link: "/attachment",
  },
  "Create Bank": {
    icon: "panorama_fish_eye",
    link: "/bankManager",
  },

  Sale: {
    icon: "panorama_fish_eye",
    link: "/sale",
  },

  SaleDetail: {
    icon: "panorama_fish_eye",
    link: "/sale",
  },
  Customer: {
    icon: "panorama_fish_eye",
    link: "/sale",
  },
};
const productTypes = [
  { id: 1, type: "Inventory" },
  { id: 2, type: "Non inventory" },
  { id: 3, type: "Service" },
  { id: 4, type: "Bundle" },
];
const charKhataTypes = [
  { id: 100, type: "Asset" },
  { id: 200, type: "Liabities" },
  { id: 300, type: "Income" },
  { id: 400, type: "Expenses" },
];
const netDues = [15, 30, 60];
const taxType = [
  {
    label: "Exclusive Tax",
    value: 1,
  },
  {
    label: "Inclusive Tax",
    value: -1,
  },
];
const Apis = {
  UserRegisterApi: `${API_URL}/api/auth/register`,
  GetAllUsersApi: `${API_URL}/api/user/getUsers`,
  CreateUserApi: `${API_URL}/api/user/createUser`,
  UpdateUserApi: `${API_URL}/api/user/updateUser`,
  DeleteUserApi: `${API_URL}/api/user/deleteUser`,
  ResetUserPasswordApi: `${API_URL}/api/user/updatePassword`,
  EmailLoginApi: `${API_URL}/api/auth/authenticate`,
  JwtLoginApi: `${API_URL}/api/auth/jwt`,
  //Branch Apis
  GetAllBranchApi: `${API_URL}/api/branch/getAllBranch`,
  CreateBranchApi: `${API_URL}/api/branch/createBranch`,
  UpdateBranchApi: `${API_URL}/api/branch/updateBranch`,
  RemoveBranchApi: `${API_URL}/api/branch/removeBranch`,

  //Role APis
  GetAllRolesApi: `${API_URL}/api/role/getRoles`,
  CreateRoleApi: `${API_URL}/api/role/createRole`,
  UpdateRoleApi: `${API_URL}/api/role/updateRole`,
  DeleteRoleApi: `${API_URL}/api/role/deleteRole`,
  GetAuthRoleApi: `${API_URL}/api/role/getAuthRole`,

  //Company Apis
  CreateCompanyApi: `${API_URL}/api/company/createCompany`,
  getCompanysApi: `${API_URL}/api/company/getUserCompanys`,
  getAllCompanysApi: `${API_URL}/api/company/getAllCompanys`,
  updateCompanyApi: `${API_URL}/api/company/updateCompany`,
  updateLogoApi: `${API_URL}/api/company/updateLogo`,
  removeCompany: `${API_URL}/api/company/removeCompany`,

  //Fiscal Apis
  CreateFiscalApi: `${API_URL}/api/fiscal/createFiscal`,
  GetFiscalApi: `${API_URL}/api/fiscal/getFiscal`,
  GetAllFiscalsApi: `${API_URL}/api/fiscal/getFiscals`,
  UpdateFiscalApi: `${API_URL}/api/fiscal/updateFiscal`,
  RemoveFiscalApi: `${API_URL}/api/fiscal/removeFiscal`,

  //Auth Role Apis
  CreateAuthRoleApi: `${API_URL}/api/authRole/createAuthRole`,
  GetUserRoleApi: `${API_URL}/api/authRole/getUserRole`,
  // GetAuthRoleApi: `${API_URL}/api/authRole/getAuthRole`,
  GetAuthRolesApi: `${API_URL}/api/authRole/getAuthRoles`,
  UpdateAuthRoleApi: `${API_URL}/api/authRole/updateAuthRole`,
  RemoveAuthRoleApi: `${API_URL}/api/authRole/removeAuthRole`,

  //Product Group Apis
  CreateProductGroupApi: `${API_URL}/api/productGroup/createProductGroup`,
  GetProductGroupApi: `${API_URL}/api/productGroup/getProductGroup`,
  GetProductGroupsApi: `${API_URL}/api/productGroup/getProductGroups`,
  UpdateProductGroupApi: `${API_URL}/api/productGroup/updateProductGroup`,
  RemoveProductGroupApi: `${API_URL}/api/productGroup/removeProductGroup`,

  //Product Service Apis
  CreateProductServiceApi: `${API_URL}/api/productService/createProductService`,
  GetProductServiceApi: `${API_URL}/api/productService/getProductService`,
  GetProductServicesApi: `${API_URL}/api/productService/getProductServices`,
  UpdateProductServiceApi: `${API_URL}/api/productService/updateProductService`,
  RemoveProductServiceApi: `${API_URL}/api/productService/removeProductService`,

  //Create of Account Apis
  CreateChartOfAccountApi: `${API_URL}/api/chartOfAccount/createChartOfAccount`,
  GetChartOfAccountApi: `${API_URL}/api/chartOfAccount/getChartOfAccount`,
  GetAllChartOfAccount: `${API_URL}/api/chartOfAccount/getAllChartOfAccount`,
  GetChartOfAccountsApi: `${API_URL}/api/chartOfAccount/getChartOfAccounts`,
  UpdateChartOfAccountApi: `${API_URL}/api/chartOfAccount/updateChartOfAccount`,
  RemoveChartOfAccountApi: `${API_URL}/api/chartOfAccount/removeChartOfAccount`,
  GetAccoutLedgerNameList: `${API_URL}/api/chartOfAccount/getAccoutLedgerNameList`,
  GetChartOfAccountsaApi: `${API_URL}/api/chartOfAccount/getChartOfAccountsa`,
  getCharKhataReportApi : `${API_URL}/api/CharKhataReport/GetCharkhata`,
  getAcpayable : `${API_URL}/api/ShareCapitalReport/GetAccountPayable`,
  getRecieveable : `${API_URL}/api/ShareCapitalReport/GetAccountReceivable`,
  getSalaryPayable : `${API_URL}/api/ShareCapitalReport/GetSalaryPayable`,
  getShareCapital : `${API_URL}/api/ShareCapitalReport/getShareCapital`,
  GetStatement : `${API_URL}/api/Report/GetStatements`,


  //Create of User Log Apis
  CreateUserLogApi: `${API_URL}/api/userLog/createUserLog`,
  GetUserLogApi: `${API_URL}/api/userLog/getUserLog`,
  GetUserLogsApi: `${API_URL}/api/userLog/getUserLogs`,
  UpdateUserLogApi: `${API_URL}/api/userLog/updateUserLog`,
  RemoveUserLogApi: `${API_URL}/api/userLog/removeUserLog`,

  //Create of Bank Apis
  CreateBankApi: `${API_URL}/api/bank/createBank`,
  GetBankApi: `${API_URL}/api/bank/getBank`,
  GetBanksApi: `${API_URL}/api/bank/getBanks`,
  UpdateBankApi: `${API_URL}/api/bank/updateBank`,
  RemoveBankApi: `${API_URL}/api/bank/removeBank`,
  GetBankAmount: `${API_URL}/api/bank/getBankAmount`,

  //Create of Transaction Apis
  CreateTransactionApi: `${API_URL}/api/transaction/createTransaction`,
  GetTransactionApi: `${API_URL}/api/transaction/getTransaction`,
  GetTransactionsApi: `${API_URL}/api/transaction/getTransactions`,
  GetTransactionsByTypeApi: `${API_URL}/api/transaction/getTransactionsByType`,
  UpdateTransactionApi: `${API_URL}/api/transaction/updateTransaction`,
  GetVoucherNumber: `${API_URL}/api/transaction/getVoucherNumber`,
  RemoveTransactionApi: `${API_URL}/api/transaction/removeTransaction`,
  GetTransactionsVoucher: `${API_URL}/api/transaction/getTransactionsVoucher`,
  CreateVoucher: `${API_URL}/api/transaction/createVoucher`,
  RemoveTransaction: `${API_URL}/api/transaction/removeTransaction`,
  RemoveCurrentVoucher: `${API_URL}/api/transaction/removeCurrentVoucher`,
  GetBookTransactions: `${API_URL}/api/report/getBookTransactions`,
  GetCashBook: `${API_URL}/api/report/GetCashBook`,
  GetFilterTransactions: `${API_URL}/api/report/getFilterTransactions`,
  GetVoucherNo: `${API_URL}/api/transaction/getVoucherNo`,
  GetVoucherDetails: `${API_URL}/api/report/GetVoucherDetails`,
  GetVoucherByVoucherNumber: `${API_URL}/api/report/GetVoucherByVoucherNumber`,

  //Create of Customer Apis
  CreateCustomerApi: `${API_URL}/api/customer/createCustomer`,
  GetCustomerApi: `${API_URL}/api/customer/getCustomer`,
  GetCustomersApi: `${API_URL}/api/customer/getCustomers`,
  UpdateCustomerApi: `${API_URL}/api/customer/updateCustomer`,
  RemoveCustomerApi: `${API_URL}/api/customer/removeCustomer`,
  GetCustomerWithBalanceApi: `${API_URL}/api/customer/GetCustomerWithBalance`,

  //Create of Supplier Apis
  CreateSupplierApi: `${API_URL}/api/supplier/createSupplier`,
  GetSupplierApi: `${API_URL}/api/supplier/getSupplier`,
  GetSuppliersApi: `${API_URL}/api/supplier/getSuppliers`,
  UpdateSupplierApi: `${API_URL}/api/supplier/updateSupplier`,
  RemoveSupplierApi: `${API_URL}/api/supplier/removeSupplier`,

  //Create of Sale Apis
  CreateSaleApi: `${API_URL}/api/sales/createSale`,
  GetSaleApi: `${API_URL}/api/sales/getSale`,
  GetInvoiceNumber: `${API_URL}/api/sales/getInvoiceNumber`,
  GetSalesApi: `${API_URL}/api/sales/getSales`,
  UpdateSaleApi: `${API_URL}/api/sales/updateSale`,
  RemoveSaleApi: `${API_URL}/api/sales/removeSale`,

  //Create of SaleDetail Apis
  CreateSaleDetailApi: `${API_URL}/api/saleDetail/createSaleDetail`,
  GetSaleDetailApi: `${API_URL}/api/saleDetail/getSaleDetail`,
  GetSaleDetailsApi: `${API_URL}/api/saleDetail/getSaleDetails`,
  GetSaleDetailsByInvApi: `${API_URL}/api/saleDetail/getSaleDetailsByInv`,
  UpdateSaleDetailApi: `${API_URL}/api/saleDetail/updateSaleDetail`,
  RemoveSaleDetailApi: `${API_URL}/api/saleDetail/removeSaleDetail`,

  //Create of Estimate Apis
  CreateQuotationApi: `${API_URL}/api/Quotation/createQuotation`,
  GetQuotationApi: `${API_URL}/api/Quotation/getQuotation`,
  GetQInvoiceNumber: `${API_URL}/api/Quotation/getInvoiceNumber`,
  GetQuotationsApi: `${API_URL}/api/Quotation/getQuotations`,
  UpdateQuotationApi: `${API_URL}/api/Quotation/updateQuotation`,
  RemoveQuotationApi: `${API_URL}/api/Quotation/removeQuotation`,

  //Create of EstimateDetail Apis
  CreateQuotationDetailApi: `${API_URL}/api/QuotationDetails/createQuotationDetail`,
  GetQuotationDetailApi: `${API_URL}/api/QuotationDetails/getQuotationDetail`,
  GetQuotationDetailsApi: `${API_URL}/api/QuotationDetails/getQuotationDetails`,
  GetQuotationDetailsByInvApi: `${API_URL}/api/QuotationDetails/getQuotationDetailsByInv`,
  UpdateQuotationDetailsApi: `${API_URL}/api/QuotationDetails/updateQuotationDetails`,
  RemoveQuotationDetailsApi: `${API_URL}/api/QuotationDetails/removeQuotationDetails`,

  //Create of Purchase Apis
  CreatePurchaseApi: `${API_URL}/api/purchase/createPurchase`,
  GetPurchaseApi: `${API_URL}/api/purchase/getPurchase`,
  GetPurchasesApi: `${API_URL}/api/purchase/getPurchases`,
  UpdatePurchaseApi: `${API_URL}/api/purchase/updatePurchase`,
  RemovePurchaseApi: `${API_URL}/api/purchase/removePurchase`,
  GetPurchaseNumber: `${API_URL}/api/purchase/getPurchaseNumber`,

  //Create of PurchaseDetail Apis
  CreatePurchaseDetailApi: `${API_URL}/api/purchaseDetail/createPurchaseDetail`,
  GetPurchaseDetailApi: `${API_URL}/api/purchaseDetail/getPurchaseDetail`,
  GetPurchaseDetailsApi: `${API_URL}/api/purchaseDetail/getPurchaseDetails`,
  GetPurchaseDetailsByInvApi: `${API_URL}/api/purchaseDetail/getPurchaseDetailsByInv`,
  UpdatePurchaseDetailApi: `${API_URL}/api/purchaseDetail/updatePurchaseDetail`,
  RemovePurchaseDetailApi: `${API_URL}/api/purchaseDetail/removePurchaseDetail`,

  //Create of Project Apis
  CreateProjectApi: `${API_URL}/api/project/createProject`,
  GetProjectApi: `${API_URL}/api/project/getProject`,
  GetProjectsApi: `${API_URL}/api/project/getProjects`,
  UpdateProjectApi: `${API_URL}/api/project/updateProject`,
  RemoveProjectApi: `${API_URL}/api/project/RemoveProject`,
  GetAllProjects: `${API_URL}/api/project/getAllProjects`,

  //Create of AutoNumber Apis
  CreateAutoNumberApi: `${API_URL}/api/autoNumber/createAutoNumber`,
  GetAutoNumberApi: `${API_URL}/api/autoNumber/getAutoNumber`,
  GetAutoNumbersApi: `${API_URL}/api/autoNumber/getAutoNumbers`,
  UpdateAutoNumberApi: `${API_URL}/api/autoNumber/updateAutoNumber`,
  RemoveAutoNumberApi: `${API_URL}/api/autoNumber/removeAutoNumber`,

  // Create of Tasks Apis
  GetAllTasks: `${API_URL}/api/Task/getAllTasks`,
  CreateTask: `${API_URL}/api/Task/createTask`,
  UpdateTask: `${API_URL}/api/Task/updateTask`,
  GetEmployeeNames: `${API_URL}/api/Task/getEmployeeNames`,

  //Create of Budget Apis
  CreateBudgetApi: `${API_URL}/api/budget/createBudget`,
  GetBudgetApi: `${API_URL}/api/budget/getBudget`,
  GetBudgetsApi: `${API_URL}/api/budget/getBudgets`,
  UpdateBudgetApi: `${API_URL}/api/budget/updateBudget`,
  RemoveBudgetApi: `${API_URL}/api/budget/removeBudget`,

  //Create of BudgetDetail Apis
  CreateBudgetDetailApi: `${API_URL}/api/budgetDetail/createBudgetDetail`,
  GetBudgetDetailApi: `${API_URL}/api/budgetDetail/getBudgetDetail`,
  GetBudgetDetailsApi: `${API_URL}/api/budgetDetail/getBudgetDetails`,
  UpdateBudgetDetailApi: `${API_URL}/api/budgetDetail/updateBudgetDetail`,
  RemoveBudgetDetailApi: `${API_URL}/api/budgetDetail/removeBudgetDetail`,

  //Create of BudgetDetail Apis
  GetTaxList: `${API_URL}/api/tax/getTaxList`,
  CreateTax: `${API_URL}/api/tax/createTax`,
  RemoveTax: `${API_URL}/api/tax/removeTax`,
  UpdateTax: `${API_URL}/api/tax/updateTax`,
  GetTaxReport: `${API_URL}/api/report/getTaxReport`,
  GetTaxLedgers: `${API_URL}/api/tax/getTaxLedgers`,

  //Accountmaster APIs
  CreateAccount: `${API_URL}/api/accountmaster/createAccount`,
  GetAllAccountMaster: `${API_URL}/api/accountmaster/getAccountMaster`,

  //File Apis
  UploadFileApi: `${API_URL}/api/file/uploadFile`,

  //ReceivePayment APIs
  CreateReceivePayment: `${API_URL}/api/ReceivePayment/createReceivePayment`,
  GetReceivePayments: `${API_URL}/api/ReceivePayment/getReceivePayments`,
  RemoveReceivePayments: `${API_URL}/api/ReceivePayment/removeReceivePayments`,

  //Create of StockAdjustments Apis
  CreateStockAdjustment: `${API_URL}/api/StockAdjustment/createStockAdjustment`,
  GetStockAdjustment: `${API_URL}/api/StockAdjustment/getStockAdjustment`,
  GetAdjustmentNumber: `${API_URL}/api/StockAdjustment/getAdjustmentNumber`,
  GetStockAdjustments: `${API_URL}/api/StockAdjustment/getStockAdjustments`,
  UpdateStockAdjustment: `${API_URL}/api/StockAdjustment/updateStockAdjustment`,
  RemoveStockAdjustment: `${API_URL}/api/StockAdjustment/removeStockAdjustment`,

  //Create of StockAdjustmentDetails Apis
  CreateStockAdjustmentDetail: `${API_URL}/api/StockAdjustmentDetails/createStockAdjustmentDetail`,
  GetStockAdjustmentDetail: `${API_URL}/api/StockAdjustmentDetails/getStockAdjustmentDetail`,
  GetStockAdjustmentDetailByAdjNo: `${API_URL}/api/StockAdjustmentDetails/getStockAdjustmentDetailByAdjNo`,
  UpdateStockAdjustmentDetail: `${API_URL}/api/StockAdjustmentDetails/updateStockAdjustmentDetail`,
  RemoveStockAdjustmentDetail: `${API_URL}/api/StockAdjustmentDetails/removeStockAdjustmentDetail`,

  //Create of Attachment Apis
  CreateNewAttachment: `${API_URL}/api/Attachment/createNewAttachment`,
  GetAllAttachment: `${API_URL}/api/Attachment/getAllAttachment`,
  GetAttachment: `${API_URL}/api/Attachment/getAttachment`,
  UpdateAttachment: `${API_URL}/api/Attachment/updateAttachment`,
  RemoveAttachment: `${API_URL}/api/Attachment/removeAttachment`,

  //Create of Unit Apis
  getUnitList: `${API_URL}/api/Unit/getUnitList`,

  //Create of dashboard Apis
  GetDashboardData: `${API_URL}/api/Dashboard/GetDashboardData`,
  GetTotalExpense: `${API_URL}/api/Dashboard/GetExpenseTotalA`,
  GetTotalIncome: `${API_URL}/api/Dashboard/GetIncomeTotal`,
  GetTotalSales: `${API_URL}/api/Dashboard/GetSalesTotal`,
  GetProftLoss: `${API_URL}/api/Dashboard/GetProftLoss`,
  GetNewCustomer: `${API_URL}/api/Dashboard/GetCustomerCount`,
  GetTotalEmployee: `${API_URL}/api/Dashboard/GetTotalEmployee`,


  CreateGodownApi: `${API_URL}/api/Godown/CreateGodown`,
  GetGodownApi: `${API_URL}/api/Godown/getGodown`,
  GetGodownsApi: `${API_URL}/api/Godown/getGodowns`,
  UpdateGodownApi: `${API_URL}/api/Godown/updateGodown`,
  RemoveGodownApi: `${API_URL}/api/Godown/RemoveGodown`,
  GetAllGodowns: `${API_URL}/api/GoDown/getAllGoDown`,
};
export { API_URL, Apis, Menus, productTypes, charKhataTypes, netDues, taxType };
