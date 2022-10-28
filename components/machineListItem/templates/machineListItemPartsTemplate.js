import React from "react"
import PropTypes from "prop-types"

import { Checkbox, Spacing, Field, Text, StatusText } from "components"
import { CONSTANTS } from "config"

import { CalendarIcon, TeardropIcon } from "images"

import {
  Heading,
  IconsWithInfoWrapper,
  IconWithInfo,
  IconWrapper,
  ImageWrapper,
  Infobutton,
  InfoRow,
  InfoWrapper,
  InSaleWrapper,
  PortalButtonList,
  PriceWrapper,
  StyledLink,
  Wrapper,
  CheckboxWrapper,
  CommentsWrapper,
  BrandWrapper,
  WrapperFilds,
} from "../styledComponents"
import { PortalButton } from "../portalButton"

export const MachineListItemPartsTemplate = ({
  translations,
  machineItem: {
    id,
    brand,
    model,
    salesAdTitleSupplement,
    year,
    salesPrice,
    status,
    category,
    mid,
    types,
    comments,
    symbol,
  },
  handleFieldOnChange,
  statusOptions,
  user,
  renderImage,
  picture,
  sites,
  getAdUrl,
  getIcon,
  handlePortalActionClick,
  handleAdStatusClick,
  location,
  primaryColor,
  secondaryColor,
  changeCheckbox,
  checked,
  changeScrollPosition,
}) => (
  <Wrapper key={id}>
    <CheckboxWrapper primary={primaryColor} secondary={secondaryColor}>
      <Checkbox onChange={() => changeCheckbox(id)} checked={!!checked[id]} />
    </CheckboxWrapper>
    <ImageWrapper onClick={() => changeScrollPosition(window.scrollY)}>
      {renderImage(picture)}
    </ImageWrapper>
    <InfoWrapper>
      <InfoRow>
        <Heading>
          <Spacing>
            <BrandWrapper>
              <StyledLink onClick={() => changeScrollPosition(window.scrollY)}>
                <Text variant="H5">
                  {`${brand} ${model} ${salesAdTitleSupplement ?? ""}`}
                </Text>
              </StyledLink>
              <PriceWrapper>
                <Field
                  name="salesPrice"
                  defaultValue={salesPrice || ""}
                  defaultUnit={symbol}
                  onChange={handleFieldOnChange}
                  propsToPass={{
                    type: "number",
                    text:
                      translations["+ ADD PRICE"]?.value || CONSTANTS.ADD_PRICE,
                  }}
                />
              </PriceWrapper>
            </BrandWrapper>
          </Spacing>
          <WrapperFilds>
            <Text variant="Subtitle 1" color="blackMediumEmphasis">
              {translations[category]?.value || category}
              {types && (
                <>
                  {" "}
                  -{" "}
                  {types.map((type, index) => (
                    <span key={type}>
                      {index > 0 && ", "}
                      {translations[type]?.value || type}
                    </span>
                  ))}
                </>
              )}
            </Text>
            <StatusText bold variant="Subtitle 1" status={status}>
              <Field
                name="status"
                defaultValue={translations[status]?.value || status}
                component={CONSTANTS.FIELD_COMPONENT.SELECT}
                values={statusOptions?.map(
                  ({ status: statusOption }) =>
                    translations[statusOption]?.value || statusOption
                )}
                onChange={handleFieldOnChange}
                propsToPass={{
                  text:
                    translations["+ ADD STATUS"]?.value || CONSTANTS.ADD_STATUS,
                }}
              />
            </StatusText>
            <CommentsWrapper>
              <Field
                name="comments"
                defaultValue={comments}
                component={CONSTANTS.FIELD_COMPONENT.TEXT}
                onChange={handleFieldOnChange}
                propsToPass={{
                  text:
                    translations["ADD COMMENTS"]?.value ||
                    CONSTANTS.ADD_COMMENTS,
                }}
              />
            </CommentsWrapper>
          </WrapperFilds>
          <Text variant="Subtitle 1" color="blackMediumEmphasis">
            {translations["Machineric ID: "]?.value || "Machineric ID: "}
            {mid}
          </Text>
          {user && (
            <>
              {" | "}
              <Text variant="Subtitle 1" color="blackMediumEmphasis">
                {translations["Modified By"]?.value || "Modified By"}{" "}
                {user.name}
              </Text>
            </>
          )}
        </Heading>
        <StyledLink onClick={() => changeScrollPosition(window.scrollY)}>
          <Text color="primary" variant="H6">
            {translations["View/Edit"]?.value || "View/Edit"}
          </Text>
        </StyledLink>
      </InfoRow>
      <InfoRow>
        <IconsWithInfoWrapper>
          <IconWithInfo>
            <IconWrapper>
              <CalendarIcon />
            </IconWrapper>
            <Text variant="Subtitle 1" color="blackMediumEmphasis">
              {year}
            </Text>
          </IconWithInfo>
          <IconWithInfo>
            <IconWrapper>
              <TeardropIcon />
            </IconWrapper>
            <Text variant="Subtitle 1" color="blackMediumEmphasis" ellipsis>
              {location}
            </Text>
          </IconWithInfo>
        </IconsWithInfoWrapper>
        <InSaleWrapper>
          <div>
            <Text variant="Subtitle 1" color="blackMediumEmphasis">
              {translations["In sale in"]?.value || "In sale in"}
              <Infobutton type="button" onClick={() => handleAdStatusClick(id)}>
                {translations["[check status]"]?.value || "[check status]"}
              </Infobutton>
              :
            </Text>
          </div>
          <PortalButtonList>
            {sites.map(({ id: siteId, siteCode }) => (
              <PortalButton
                key={siteId}
                label={translations[siteCode]?.value || siteCode}
                url={getAdUrl(siteCode)}
                icon={getIcon(siteCode)}
                onClick={() => handlePortalActionClick(siteCode)}
              />
            ))}
          </PortalButtonList>
        </InSaleWrapper>
      </InfoRow>
    </InfoWrapper>
  </Wrapper>
)

MachineListItemPartsTemplate.defaultProps = {
  user: null,
}

MachineListItemPartsTemplate.propTypes = {
  translations: PropTypes.objectOf(PropTypes.object).isRequired,
  machineItem: PropTypes.shape({
    id: PropTypes.string,
    pictures: PropTypes.arrayOf(PropTypes.object),
    brand: PropTypes.string,
    salesAdTitleSupplement: PropTypes.string,
    model: PropTypes.string,
    location: PropTypes.string,
    subCategoryID: PropTypes.string,
    vinCode: PropTypes.string,
    licensePlate: PropTypes.string,
    meterReadOut: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    workHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salesPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    coverImage: PropTypes.string,
    category: PropTypes.string,
    mid: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.string,
    modifiedBy: PropTypes.string,
    symbol: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  handleFieldOnChange: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  renderImage: PropTypes.func.isRequired,
  changeScrollPosition: PropTypes.func.isRequired,
  picture: PropTypes.string.isRequired,
  sites: PropTypes.arrayOf(PropTypes.object).isRequired,
  getAdUrl: PropTypes.func.isRequired,
  getIcon: PropTypes.func.isRequired,
  handlePortalActionClick: PropTypes.func.isRequired,
  handleAdStatusClick: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  changeCheckbox: PropTypes.func.isRequired,
  checked: PropTypes.objectOf(PropTypes.string).isRequired,
}
