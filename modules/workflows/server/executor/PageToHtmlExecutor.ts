import { ExecutionEnvironment } from '../../../common/types/executor';
import { PageToHtmlTask } from '../../ui/tasks/page-to-html';
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}