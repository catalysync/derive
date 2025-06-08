import puppeteer from "puppeteer";
import { ExecutionEnvironment } from '../../../common/types/executor';
import { LaunchBrowserTask } from '../../ui/tasks/launch-browser/index';
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const browser =  await puppeteer.launch({
      headless: true
    });

    environment.log.info("Browser started Successfully");
    const websiteUrl = environment.getInput("Website Url");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);

    environment.log.info(`Opened page at: |${websiteUrl}`)

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}