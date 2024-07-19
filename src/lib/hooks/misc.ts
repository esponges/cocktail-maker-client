import { DepContext } from "@/components/context/dep-provider";
import { useContext, useEffect, useState } from "react";

export const useHeaderHeight = () => {
  const { refs } = useContext(DepContext);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (refs?.header?.current) {
      setHeaderHeight(refs.header.current.offsetHeight);
    }
  }, [refs?.header]);

  return { headerHeight };
};
