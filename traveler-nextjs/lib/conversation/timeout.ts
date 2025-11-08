import { getIncompleteSurveys, pauseUserDigests } from '../db/users';
import { sendSMS } from '../twilio/messages';
import { MESSAGES } from './messages';

const INCOMPLETE_SURVEY_DAYS = 3;

export async function checkAndHandleIncompleteSurveys(): Promise<{
  processed: number;
  errors: number;
}> {
  const incompleteSurveys = await getIncompleteSurveys(INCOMPLETE_SURVEY_DAYS);
  let processed = 0;
  let errors = 0;

  for (const user of incompleteSurveys) {
    try {
      // Pause user digests
      await pauseUserDigests(user.id);

      // Send pause message
      const result = await sendSMS({
        to: user.phone_number,
        body: MESSAGES.pauseMessage,
      });

      if (result.success) {
        processed++;
      } else {
        errors++;
        console.error(`Failed to send pause message to ${user.phone_number}`);
      }
    } catch (error) {
      errors++;
      console.error(`Error processing user ${user.id}:`, error);
    }
  }

  return { processed, errors };
}

