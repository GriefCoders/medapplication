import { CustomScrollbar } from "@/shared/components/scrollbar";
import type { TabsProps } from "@/shared/types/tabs";
import { Tab as HeroTab, Tabs as HeroTabs } from "@heroui/react";
import { useState } from "react";

export const Tabs = ({
  tabs,
  defaultTab,
  onChange,
  variant = "underlined",
  color = "primary",
  size = "md",
  fullWidth = false,
  className,
}: TabsProps) => {
  const [selectedKey, setSelectedKey] = useState<string>(
    defaultTab || tabs[0]?.id || ""
  );

  const handleSelectionChange = (key: React.Key) => {
    const keyString = String(key);
    setSelectedKey(keyString);
    onChange?.(keyString);
  };

  const selectedTab = tabs.find((tab) => tab.id === selectedKey);

  return (
    <div className={`w-full h-full flex flex-col ${className || ""}`}>
      <HeroTabs
        selectedKey={selectedKey}
        onSelectionChange={handleSelectionChange}
        variant={variant}
        color={color}
        size={size}
        fullWidth={fullWidth}
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary",
        }}
      >
        {tabs.map((tab) => (
          <HeroTab
            key={tab.id}
            title={
              <div className="flex items-center space-x-2">
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </div>
            }
            isDisabled={tab.disabled}
          />
        ))}
      </HeroTabs>

      {selectedTab?.header && <div className="mt-4">{selectedTab.header}</div>}

      <div className="mt-4 flex-1 overflow-hidden">
        <CustomScrollbar>{selectedTab?.content}</CustomScrollbar>
      </div>
    </div>
  );
};
