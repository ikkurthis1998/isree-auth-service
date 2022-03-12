import { replaceSpaceWithUnderScore } from "../../../utils/stringUtils/replaceSpaceWithUnderScore";

export const generateDashboardName = (businessName: string): string => {
    return `${replaceSpaceWithUnderScore(businessName.trim()).toUpperCase()}_DASHBOARD`;
}