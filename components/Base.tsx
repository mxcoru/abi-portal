import { NavigationBar } from "./NavigationBar";

export function Base({
  children,
  adminLayout,
}: {
  children: React.ReactNode;
  adminLayout?: boolean;
}) {
  if (adminLayout) {
    return (
      <div className="w-full h-svh flex flex-row">
        <NavigationBar />
        <div className="md:w-5/6 h-svh w-svw z-0 md:overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-6 grid-rows-6 p-5 gap-2">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-svh flex flex-row">
      <NavigationBar />
      <div className="flex flex-col justify-center items-center w-svh h-svh md:w-5/6">
        {children}
      </div>
    </div>
  );
}
