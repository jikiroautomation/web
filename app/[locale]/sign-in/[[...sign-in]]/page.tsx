import LayoutMain from "@/layout/layout-main";
import { SignIn } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";

export default async function SignInPage() {
  const t = await getTranslations("auth");
  return (
    <LayoutMain>
      <div className="relative min-h-screen flex flex-col">
        {/* Main Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                {t("welcomeBack")}
              </h1>
              <p className="text-gray-600 text-sm dark:text-gray-300">
                {t("signInToJikiro")}
              </p>
            </div>

            {/* Sign In Component with Enhanced Styling */}
            <div className="flex justify-center">
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300",
                    card: "bg-transparent shadow-none mx-auto",
                    rootBox: "mx-auto",
                    headerTitle: "text-gray-900 dark:text-white text-center",
                    headerSubtitle:
                      "text-gray-600 dark:text-gray-300 text-center",
                    socialButtonsBlockButton:
                      "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200",
                    socialButtonsBlockButtonText:
                      "text-gray-700 dark:text-gray-300",
                    formFieldLabel: "text-gray-700 dark:text-gray-300",
                    formFieldInput:
                      "border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400",
                    footerActionLink:
                      "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="border-t border-gray-400 dark:border-gray-600 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} JIKIRO. {t("allRightsReserved")}.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t("aiPoweredPlatform")}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </LayoutMain>
  );
}
