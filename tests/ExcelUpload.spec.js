const { test, expect } = require("@playwright/test");
const ExcelJS = require('exceljs');   //to load exceljs library add dependency in package.jason 
                                    //and in terminal run: npm install exceljs --savedev

async function writeExcel(searchText, newText, changeCoord, filePath) 
{    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    let output = await readExcel(worksheet, searchText);
    const cell = worksheet.getCell(output.row, output.column + changeCoord.colChange);
    cell.value = newText;
    await workbook.xlsx.writeFile(filePath)
}

async function readExcel(worksheet, searchText)
{
    let output = {row:-1, column:-1};
    worksheet.eachRow((row, rowNumber) =>
        {
            row.eachCell((cell, colNumber) =>
                {
                    if(cell.value === searchText)
                    {
                        output.row = rowNumber;
                        output.column = colNumber;
                    }
                });

        });
        return output;    
}


test("Excel download and upload", async({page}) =>
    {
        const searchText = 'Mango';
        const newText = "7000";
        const filePath = 'D:\\Downloads_2017\\download.xlsx';
        const changeCoord = {rowChange: 0, colChange: 2};

        await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
        const downloadPromise = page.waitForEvent("download");
        await page.getByRole("button", {name: "Download"}).click();    
        const download = await downloadPromise;
        await download.saveAs(filePath);
        await writeExcel(searchText, newText, changeCoord, filePath);
        await page.locator("#fileinput").click();
        //setInputFiles works only if `input` tag has attribute `type="file"` 
        await page.locator("#fileinput").setInputFiles(filePath); 
        const textLoc = page.getByText(searchText);
        const desiredRow = await page.getByRole('row').filter({has: textLoc});
        console.log(await desiredRow.locator('#cell-4-undefined'));
        await expect(desiredRow.locator("#cell-4-undefined")).toContainText(newText);
    
    });
