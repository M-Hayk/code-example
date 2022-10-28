import React, { useState, useRef } from "react"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"

import { Text } from "components"
import { CONSTANTS } from "config"
import {
  GrayUploadRectangleIcon,
  GreenUploadRectangleIcon,
  RedCrossRectangleIcon,
  YellowUploadRectangleIcon,
  GreenCheckRectangleIcon,
} from "images"

const TIME_TO_CHECK_IF_MOUSE_STILL_HOVERING = 50

const Wrapper = styled.div`
  ${({ theme }) => css`
    display: inline-flex;

    justify-content: center;
    vertical-align: middle;

    svg {
       margin-right: ${theme.spacing}px;
    }

    & > ${Text} {
      width 96px;
    }
  `}
`

const ActionButton = styled.div`
  outline: none;
`

const DynamicIconWrapper = styled.div`
  cursor: pointer;
`

const DynamicIcon = ({
  defaultIcon: DefaultIcon,
  mouseOverIcon: MouseOverIcon,
}) => {
  const ref = useRef()
  const [isMouseOver, setIsMouseOver] = useState(false)

  const handleOnMouseEnter = () => {
    setIsMouseOver(true)

    setTimeout(() => {
      if (ref.current && ref.current.matches(":hover") === false) {
        setIsMouseOver(false)
      }
    }, TIME_TO_CHECK_IF_MOUSE_STILL_HOVERING)
  }

  return (
    <DynamicIconWrapper
      ref={ref}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {isMouseOver ? <MouseOverIcon /> : <DefaultIcon />}
    </DynamicIconWrapper>
  )
}

const ActiveIcon = () => (
  <DynamicIcon
    defaultIcon={() => <GreenCheckRectangleIcon />}
    mouseOverIcon={() => <RedCrossRectangleIcon />}
  />
)

const InactiveIcon = () => (
  <DynamicIcon
    defaultIcon={() => <GrayUploadRectangleIcon />}
    mouseOverIcon={() => <GreenUploadRectangleIcon />}
  />
)

const LoadingIcon = () => (
  <DynamicIcon
    defaultIcon={() => <YellowUploadRectangleIcon />}
    mouseOverIcon={() => <RedCrossRectangleIcon />}
  />
)

const icons = {
  [CONSTANTS.AD_STATUSES.ACTIVE]: () => <ActiveIcon />,
  [CONSTANTS.AD_STATUSES.INACTIVE]: () => <InactiveIcon />,
  [CONSTANTS.AD_STATUSES.LOADING]: () => <LoadingIcon />,
}

const renderIcon = (icon) => icons[icon]()

export const PortalButton = ({ label, icon, onClick, url }) => (
  <Wrapper>
    <ActionButton
      role="button"
      tabIndex="0"
      onClick={onClick}
      onKeyDown={({ key }) => (key === "Enter" ? onClick() : null)}
    >
      {renderIcon(icon)}
    </ActionButton>
    <a href={url !== "#" ? url : null} target="_blank" rel="noreferrer">
      <Text
        color={url !== "#" ? "primary" : "blackMediumEmphasis"}
        width={96}
        lineHeight={2}
        variant="Body 1"
      >
        {label}
      </Text>
    </a>
  </Wrapper>
)

PortalButton.defaultProps = {
  url: null,
}

PortalButton.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

DynamicIcon.propTypes = {
  defaultIcon: PropTypes.func.isRequired,
  mouseOverIcon: PropTypes.func.isRequired,
}
