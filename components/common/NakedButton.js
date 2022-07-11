import React from "react";
import styled from "styled-components";

const NakedButtonWrapper = styled.button`
    position: inline;
    background: transparent;
    border: none;
    cursor: ${props => props.disabled ? "not-allowed" : "pointer" };
    padding: 0px;
    /* Detects if wheter or not the outline should appear on tab */
    outline: none;
    cursor: ${props => props.noCursor && "default"};

`

// A completley unstyled button wrapped to replace the A tag with #actions elements
// Used for actionable text and icon elements 
class NakedButton extends React.Component {

    render() {
        const {
            children, 
            onClick, 
            disabled,
            type,
            noCursor,
            id
        } = this.props;

        return (
            <NakedButtonWrapper onClick={onClick} disabled={disabled} type={type} noCursor={noCursor} id={id}>
                {children}
            </NakedButtonWrapper>
        );
    }
}

export default NakedButton;
