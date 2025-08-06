import { commonReturn } from "../utils/functions.js";
import { bulkInsertDataToTable } from "./bulk-insert.repository.js";

export const bulkInsertToTable = async (req, res) => {
  const { data } = req.body;
  const { tableName } = req.params;

  if (!Array.isArray(data)) {
    return commonReturn(res, 400, false, null, "Invalid data format");
  }

  const allowedTables = [
    "OrganisationCategory",
    "OrganisationIndustry",
    "AuditType",
    "AuditStandard",
    "AuditInstance",
    "AuditeeOrganisation",
  ];

  if (!allowedTables.includes(tableName)) {
    return commonReturn(res, "Invalid table name", null, 400);
  }

  try {
    await bulkInsertDataToTable(data, tableName);
    return commonReturn(res, "Inserted successfully");
  } catch {
    return commonReturn(res, null, null, 500);
  }
};
