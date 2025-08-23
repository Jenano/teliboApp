import { listReviews } from "../../../lib/repositories/reviewsRepo";
import RecenzeSlider from "./RecenzeSlider";

export default async function RecenzeSection() {
  const reviews = await listReviews();
  return <RecenzeSlider reviews={reviews} />;
}
