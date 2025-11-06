import { HomeTabs } from "./home-tabs";

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-start h-full overflow-hidden">
      <div className="w-full max-w-4xl h-full">
        <HomeTabs />
      </div>
    </div>
  );
};
