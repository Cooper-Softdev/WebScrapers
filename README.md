# Children's Hospitals Web Scraper

A web scraper tool designed to extract information on children's hospitals from `https://www.childrenshospitals.org/hospital-directory`. The gathered data supports a thesis research project on children's hospitals.

## Features:

- Fetches the list of children's hospitals and associated details.
- Extracts hospital name, address, phone number, web address, number of staffed beds, type of hospital, and system association.
- Exports the collected data to a `data.json` file.

## Prerequisites:

- [Node.js](https://nodejs.org/)
- [Puppeteer](https://pptr.dev/): A Node.js library which provides a high-level API over the Chrome or Chromium browser.
  
## Setup:

1. Clone this repository to your local machine.
   ```
   git clone https://github.com/Cooper-Softdev/WebScrapers.git
   ```

2. Navigate to the project directory.
   ```
   cd webscrapers
   ```

3. Install the necessary packages.
   ```
   npm install
   ```

4. Run the scraper.
   ```
   node scraper.js
   ```

5. Once the scraping is complete, the data will be saved in a `data.json` file within the project directory.

## Notes:

- The script is designed to process in batches, scraping information for every 10 hospitals at a time.
- To avoid potential blocking or rate-limiting, a random delay between 3 to 8 seconds is implemented between fetches.

## Disclaimer:

Please ensure that you have the right to scrape the website and are in compliance with its `robots.txt` file or terms of service. This script is for educational and research purposes only.

---
