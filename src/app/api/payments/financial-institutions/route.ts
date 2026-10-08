import { getAuth, proxy } from "@/server/http";
import { getFinancialInstitutions } from "@/server/payments/payments.service";

export async function GET(request: Request) {
    return proxy(() => getFinancialInstitutions(getAuth(request)));
}
