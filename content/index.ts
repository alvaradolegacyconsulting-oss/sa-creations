// Every content export, in one object. The production gates walk all of it, so a new content file
// only needs adding here. Relative imports only (loaded under tsx).
import { contact } from "./contact";
import { gallery } from "./gallery";
import { hero } from "./hero";
import { headerNav, navLabels } from "./navigation";
import { openQuestions } from "./pending";
import { services, servicesSection } from "./services";
import { site } from "./site";
import { story } from "./story";
import { values } from "./values";

export const content = {
  site,
  hero,
  values,
  servicesSection,
  services,
  gallery,
  story,
  contact,
  headerNav,
  navLabels,
  openQuestions,
};
