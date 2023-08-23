const puppeteer = require("puppeteer");
const fs = require("fs");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const base_url_patterned =
    "https://www.childrenshospitals.org/hospital-directory#first={}&sort=%40z95xdisplayname%20ascending";
  const base_url_first =
    "https://www.childrenshospitals.org/hospital-directory#sort=%40z95xdisplayname%20ascending";

  let data = [];

  for (let i = 0; i < 224; i += 10) {
    console.log(`Scraping page starting with hospital ${i + 1}`);
    const url = i === 0 ? base_url_first : base_url_patterned.replace("{}", i);

    await page.goto(url, { waitUntil: "networkidle2" });

    // Scrape the data
    const hospitals = await page.$$eval(
      ".coveo-result-frame.coveoforsitecore-template",
      (hospitals) => {
        return hospitals.map((hospital) => {
          const name = hospital.querySelector("h2").textContent.trim();
          const descriptionElement = hospital.querySelector(
            "div.search-card-description p"
          );
          const textNodes = [...descriptionElement.childNodes].filter(
            (node) => node.nodeType === 3
          ); // Get only text nodes

          const addressParts = [];
          let phone = "";

          textNodes.forEach((node) => {
            const text = node.textContent.trim();
            // If the text matches the phone number pattern, it's a phone number; otherwise, it's part of the address.
            if (/\(\d{3}\) \d{3}-\d{4}/.test(text)) {
              phone = text;
            } else {
              addressParts.push(text);
            }
          });

          const address = addressParts.join(", ");

          const web_address =
            hospital.querySelector(".search-card-hospital-background a")
              ?.href || "unknown";
          const descriptions = [
            ...hospital.querySelectorAll(
              ".search-card-hospital-background .description"
            ),
          ];
          const staffed_beds = descriptions[1]?.textContent.trim() || "unknown";
          const hospital_type =
            descriptions[2]?.textContent.trim() || "unknown";
          const part_of_system =
            descriptions[3]?.textContent.trim() || "unknown";

          return {
            name,
            address,
            phone,
            web_address,
            staffed_beds,
            hospital_type,
            part_of_system,
          };
        });
      }
    );

    data.push(...hospitals);

    // Click the next button to navigate to the next page
    const nextButton = await page.$(".coveo-pager-next");
    if (nextButton) {
      await nextButton.click();
      await page.waitForTimeout(3000 + Math.random() * 5000); // Random delay between 3-8 seconds
    }
  }

  console.log("Scraping complete. Saving to a file...");
  await writeFile("data.json", JSON.stringify(data, null, 2));
  console.log("Data saved to data.json");

  await browser.close();
})();
