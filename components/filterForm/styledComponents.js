/* eslint-disable no-magic-numbers */
import styled, { css } from "styled-components"
import { withProp, theme, ifProp } from "styled-tools"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import MenuItem from "@material-ui/core/MenuItem"
import Popper from "@material-ui/core/Popper"

import { FormControl, Button } from "components"

import { CONSTANTS } from "config"

export const Form = styled.form`
  display: flex;

  max-width: ${CONSTANTS.STYLES.MAX_CONTENT_WIDTH};
  margin: 0 auto;
  padding: 8px 0;

  text-align: center;

  & > * {
    margin: ${theme("spacing")}px;
  }
`

export const StyledFormSelectControl = styled(FormControl)`
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 4px;

  .MuiFormLabel-filled + div {
    border-bottom: 0 !important;
  }

  & > div {
    & > div {
      .MuiFormLabel-filled + div::before {
        border: 0 !important;
      }
      background: transparent !important;

      & > div {
        .MuiFormLabel-filled + div::before {
          border: 0 !important;
        }
        background: transparent !important;
        color: rgba(0, 0, 0, 0.6);
      }

      & > div::before {
        border: 0 !important;
      }
    }
  }
`

export const StyledFormTextControl = styled(FormControl)`
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 4px;

  .MuiFormLabel-filled + div {
    &::before {
      border-bottom: 0 !important;
    }
  }

  .MuiFilledInput-underline:before,
  .MuiFilledInput-underline:after {
    border-bottom: 0 !important;
  }

  .MuiInputBase-input {
    background: white;
    color: rgba(0, 0, 0, 0.6);
  }

  & > div {
    & > div {
      background: white;
    }
  }
`

export const Wrapper = styled.div`
  // background-color: ${theme("surface.menu")};
  // box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.14), 0px 2px 2px rgba(0, 0, 0, 0.12),
  //   0px 1px 3px rgba(0, 0, 0, 0.2);
`

export const CheckedCheckBox = styled(CheckBoxIcon)`
  height: 29px;
  width: auto;

  color: ${theme("primary.800")};
`

export const UnCheckedCheckBox = styled(CheckBoxOutlineBlankIcon)`
  height: 29px;
  width: auto;

  color: ${theme("primary.800")};
`

export const SelectMenuItem = styled(MenuItem).withConfig({
  shouldForwardProp: (prop) => !["indented"].includes(prop),
})`
  display: flex;
  align-items: center;

  padding: 4px 8px;

  svg {
    margin-right: ${withProp("theme.spacing", (spacing) => spacing * 2)}px;
  }

  background-color: unset !important;

  ${ifProp(
    "indented",
    css`
      margin-left: ${withProp("theme.spacing", (spacing) => spacing * 6)}px;
    `
  )}
`

export const SelectMenuItemToggleException = styled(SelectMenuItem)`
  width: 90%;
  margin: 0 auto;
  padding: 8px 0 0 0;

  border: 1px solid black;
  // border-top: 2px solid black;
  border-color: rgba(0, 0, 0, 0.12);
`

export const StyledSearchButton = styled(Button)`
  width: 80%;
  border-color: white !important;
  padding: 10px !important;
  > span:first-child {
    line-height: 18px;
  }
`

export const StyledSearchMenu = styled(Button)`
  width: 20%;
`
export const StyledPopper = styled(Popper)`
  z-index: 100;
`

export const ButtonGroupWrapper = styled.div`
  ${({ primary, secondary }) => css`
    display: flex;
    width: 100%;
    button {
      background: ${secondary || primary};
    }
    button:hover {
      background: ${secondary || primary};
    }
  `}
`
