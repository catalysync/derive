import { ExecutionEnvironment } from '../../../common/types/executor';
import * as cheerio from 'cheerio';
import { ExtractTextFromElementTask } from '../../ui/tasks/extract-text-from-element/index';
export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = await environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector not defined");
      return false;
    }

    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("HTML not defined");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      environment.log.error("Element not found");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted text", extractedText);

    return true;
  } catch (error: any) {
    environment.log.error(message);
    return false;
  }
}