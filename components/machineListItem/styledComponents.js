import styled, { css } from "styled-components"

const WRAPPER_PADDING_SPACING = 4

export const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;

    padding: ${theme.spacing * WRAPPER_PADDING_SPACING}px 0;
  `}
`

export const InfoWrapper = styled.div`
  display: inline-block;

  width: 100%;
`

export const PriceWrapper = styled.div`
  margin-left: 16px;
  div {
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 23px;
    letter-spacing: 0.15000000596046448px;
    color: rgba(0, 0, 0, 0.6);
  }
`

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;

  table {
    tr {
      height: 26px;
    }
  }
`

export const InSaleWrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacing}px;

    & > div:first-child {
      margin-bottom: ${theme.spacing * 2}px;
    }
  `}
`

export const StyledLink = styled.span`
  display: block;

  text-decoration: none;
  cursor: pointer;
`

export const IconWithInfo = styled.div`
  display: flex;
  align-items: center;
`

export const IconWrapper = styled.div`
  display: inline-flex;

  justify-content: center;
  align-items: center;

  height: 33px;
  width: 33px;
  min-height: 33px;
  min-width: 33px;
`

export const PortalButtonList = styled.div`
  ${({ theme }) => css`
    display: flex;

    line-height: 0;
    flex-grow: 1;
    flex-wrap: wrap;

    height: 80%;
    margin-top: ${theme.spacing * 2};
  `}
`

export const IconsWithInfoWrapper = styled.div`
  min-width: 309px;
`

export const Infobutton = styled.button`
  font-size: 10px;
  border: 0px solid green;
  color: dimgrey;
`

export const ImageWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;

    height: 280px;

    padding: ${theme.spacing}px ${theme.spacing * 2}px ${theme.spacing}px 0;
    > div {
      margin-top: -20px;
      height: 280px;
      width: 320px;
    }
    svg {
      margin-top: -45px;
      height: 280px;
      width: 320px;
      rect {
        height: 280px;
        width: 320px;
      }
    }
  `}
`

export const CheckboxWrapper = styled.div`
  ${({ primary, secondary }) => css`
    display: flex;
    align-items: flex-start;
    width: 40px;
    span {
      color: ${primary || secondary};
      padding: 0;
      margin-right: 35px;
    }
    svg {
      color: ${primary || secondary};
    }
  `}
`

export const Heading = styled.div`
  ${({ theme }) => css`
    padding: 0 ${theme.spacing}px 12px ${theme.spacing}px;
  `}
`

export const Image = styled.div`
  position: relative;

  width: 272px;
  height: 204px;

  background-image: url(${({ s3Image }) => s3Image});
  background-size: cover;
  background-position: center;
`

export const ImageLabel = styled.div`
  ${({ theme }) => css`
    display: flex;
    position: absolute;

    justify-content: center;
    align-items: center;

    cursor: default;

    width: 48px;
    height: 40px;
    bottom: ${theme.spacing}px;
    right: ${theme.spacing}px;
    border: none;
    border-radius: 4px;

    background-color: ${theme.text.white.highEmphasis};
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.14), 0px 2px 2px rgba(0, 0, 0, 0.12),
      0px 1px 3px rgba(0, 0, 0, 0.2);
  `}
`

export const CommentsWrapper = styled.div`
  div {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0.15000000596046448px;
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.6);
    max-width: 300px;
  }
`

export const BrandWrapper = styled.div`
  div {
    max-width: 750px;
    margin-left: 0;
  }
  div:nth-child(2) {
    margin-top: 10px;
  }
`

export const WrapperFilds = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`
