import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { google } from "googleapis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "your-spreadsheet-id"; // شناسه صفحه گسترده خود را وارد کنید
    const range = "Sheet1!A1:C10"; // محدوده‌ای که می‌خواهید بخوانید

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error accessing Google Sheets:", error);
    res.status(500).json({ error: "Failed to access Google Sheets" });
  }
}
