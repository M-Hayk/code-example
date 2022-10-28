import styled from "styled-components"
import { theme, withProp, ifProp } from "styled-tools"
import MaterialUIDivider from "@material-ui/core/Divider"

import { CONSTANTS } from "config"

const TOP_SPACING_TIMES = 3

export const ListWrapper = styled.div`
  margin: 0 auto;
  padding: 0 16px;
  max-width: ${CONSTANTS.STYLES.MAX_CONTENT_WIDTH};
`

export const ListTopBar = styled.div`
  display: flex;

  margin: ${withProp(
      "theme.spacing",
      (spacing) => spacing * TOP_SPACING_TIMES
    )}px
    0 ${theme("spacing")}px 0;

  justify-content: space-between;
  align-items: center;
`

export const SortWrapper = styled.div`
  margin: 8px;

  & > span {
    margin-right: 17px;
    z-index: 10;
  }
`

export const Divider = styled(MaterialUIDivider)`
  height: 2px;
  background: rgba(0, 0, 0, 0.12);
`

const LIST_BOTTOM_WRAPPER_BOTTOM_SPACING = 12

export const ListBottomWrapper = styled.div`
  text-align: center;

  height: 32px;

  ${ifProp("pointer", () => "cursor: pointer")};
  padding: ${withProp("theme.spacing", (spacing) => spacing * 2)}px;
  margin-bottom: ${withProp(
    "theme.spacing",
    (spacing) => spacing * LIST_BOTTOM_WRAPPER_BOTTOM_SPACING
  )}px;
`

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 56px;

  color: ${theme("dialogBoxColor.success")};
  background-color: ${theme("dialogBoxColor.greenBackground")};

  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12),
    0px 3px 5px rgba(0, 0, 0, 0.2);

  svg {
    margin-right: ${theme("spacing")}px;
  }
`

export const FooterWrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 88px;
  max-width: 1312px;
  margin: 0 auto;
  background: #ffffff;
  border: 2px solid #e8e8e8;
  border-radius: 4px 4px 0px 0px;
`

export const FooterLeftSection = styled.div`
  display: flex;
  padding-left: 64px;
  div {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;

    letter-spacing: 0.75px;
    text-transform: uppercase;

    color: #3f4040;
  }
`

export const FooterRightSection = styled.div`
  display: flex;
  align-items: center;
  padding-right: 41px;
  button {
    width: 222px;
    height: 36px;
    background: #3f4040;
    border-radius: 4px;
    display: flex;
    align-items: center;
    div {
      color: #ffffff !important;
    }
    svg {
      position: absolute;
      right: 16px;
    }
  }
  button:hover {
    background: #3f4040;
  }
  div {
    cursor: pointer;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;

    letter-spacing: 0.75px;
    text-transform: uppercase;

    color: #3f4040;
  }
`

export const SelectWrapper = styled.div`
  position: relative;
  margin-left: 32px;
`

export const Actions = styled.div`
  width: 100%;
  position: absolute;
  bottom: 36px;
  left: 0;
  z-index: 99;
  background: #ffffff;
  border: 1px solid #3f4040;
  box-sizing: border-box;
  border-radius: 4px;
  > div {
    padding: 16px 0 8px 16px;
    color: #3f4040;
  }
`
