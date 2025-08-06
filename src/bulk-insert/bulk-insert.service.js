import { commonReturn } from "../utils/functions.js";
import { bulkInsertDataToTable } from "./bulk-insert.repository.js";

export const bulkInsertToTable = async (req, res) => {
  const { data } = req.body;
  const { tableName } = req.params;
  if (!Array.isArray(data)) commonReturn(res, "Invalid data format", null, 400);

  const allowedTables = [
    "OrganisationCategory",
    "OrganisationIndustry",
    "AuditType",
    "AuditStandard",
    "AuditInstance",
    "AuditeeOrganisation",
  ];
  if (!allowedTables.includes(tableName)) {
    commonReturn(res, "Invalid table name", null, 400);
  }
  await bulkInsertDataToTable(data, tableName);
  commonReturn(res, "Inserted successfully");
};
