import React from "react";
import createCache from "@emotion/cache";
import { NonceProvider } from "react-select";

class MyNonceProvider extends NonceProvider {
  createEmotionCache = (nonce) => {
    return createCache({ nonce, container: this.props.container });
  };
}

export const SelectWrapper = ({ children, container }) => {
  return <MyNonceProvider container={container}>{children}</MyNonceProvider>;
};
