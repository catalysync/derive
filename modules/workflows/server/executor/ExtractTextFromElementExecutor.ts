import { ExecutionEnvironment } from '../../../common/types/executor';
import cheerio from "cheerio";
import { ExtractTextFromElementTask } from '../../ui/tasks/extract-text-from-element/index';
export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = await environment.getInput("Selector");
    if (!selector) return false;

    const html = environment.getInput("Html");
    if (!html) return false;

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error("Element not found");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      console.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted text", extractedText);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}