import styled from "styled-components";
import Button from "./Button";
import { HiMinus, HiPlus } from "react-icons/hi2";
import {
  Fragment,
  cloneElement,
  useCallback,
  useEffect,
  useState,
} from "react";

export const InputsContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$colums} min-content;
  gap: 1.5rem;
`;

export const InputsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DynamicInputsComponent = ({
  inputs,
  colums,
  register,
  unregister,
  onSetDynamicInputKeys,
  initializeInputContainers,
  setInitializeInputContainers,
}) => {
  const containerInputsFields = inputs.map((input) => input.props.name);
  const initialId = 0;

  const [inputContainers, setInputContainers] = useState([
    <InputsContainer $colums={colums} id={initialId} key={initialId}>
      {inputs.map((input) => (
        <Fragment key={input.props.name}>
          {!input.props.options
            ? cloneElement(input, {
                ...input.props,
                ...register(`${initialId}-${input.props.name}`),
              })
            : cloneElement(input, {
                ...input.props,
                register: { ...register(`${initialId}-${input.props.name}`) },
              })}
        </Fragment>
      ))}
      <Button
        onClick={(e) => handleCreate(e, initialId)}
        $variation="secondary"
      >
        <HiPlus />
      </Button>
    </InputsContainer>,
  ]);

  const handleRemove = useCallback(
    (e, containerId) => {
      e.preventDefault();

      setInputContainers((prevInputContainers) =>
        prevInputContainers.filter(
          (container) => container.props.id !== containerId
        )
      );

      containerInputsFields.forEach((field) => {
        unregister(`${containerId}-${field}`);
        onSetDynamicInputKeys((prevState) =>
          prevState.filter((input) => `${containerId}-${field}`)
        );
      });
    },
    [
      containerInputsFields,
      onSetDynamicInputKeys,
      setInputContainers,
      unregister,
    ]
  );

  const handleCreate = useCallback(
    (e, containerId) => {
      e.preventDefault();

      setInputContainers((prevContainers) => {
        const updatedContainers = [...prevContainers];

        const currContainer = updatedContainers.find(
          (container) => container.props.id === containerId
        );

        const currContainerIndex = updatedContainers.findIndex(
          (container) => container.props.id === containerId
        );

        if (currContainer.props.children.length === 2) {
          // If "Add" button is present, replace it with "Remove" button
          const newContainer = (
            <InputsContainer
              $colums={colums}
              id={containerId}
              key={containerId}
            >
              {...currContainer.props.children[0]}
              <Button
                onClick={(e) => handleRemove(e, containerId)}
                $variation="secondary"
              >
                <HiMinus />
              </Button>
            </InputsContainer>
          );

          updatedContainers[currContainerIndex] = newContainer;

          const newInputsKeys = containerInputsFields.map(
            (field) => `${+containerId + 1}-${field}`
          );
          onSetDynamicInputKeys((prevState) => [
            ...prevState,
            ...newInputsKeys,
          ]);
        }

        // Add "Add" button to the last container
        const newId = +containerId + 1; // Generate a new ID for the next container
        updatedContainers.push(
          <InputsContainer $colums={colums} id={newId} key={newId}>
            {inputs.map((input) => (
              <Fragment key={input.props.name}>
                {!input.props.options
                  ? cloneElement(input, {
                      ...input.props,
                      ...register(`${newId}-${input.props.name}`),
                    })
                  : cloneElement(input, {
                      ...input.props,
                      register: {
                        ...register(`${newId}-${input.props.name}`),
                      },
                    })}
              </Fragment>
            ))}

            <Button
              onClick={(e) => handleCreate(e, newId)}
              $variation="secondary"
            >
              <HiPlus />
            </Button>
          </InputsContainer>
        );

        return updatedContainers;
      });
    },
    [
      colums,
      containerInputsFields,
      handleRemove,
      inputs,
      onSetDynamicInputKeys,
      register,
    ]
  );

  useEffect(() => {
    if (initializeInputContainers) {
      setInputContainers([
        <InputsContainer $colums={colums} id={initialId} key={initialId}>
          {inputs.map((input) => (
            <Fragment key={input.props.name}>
              {!input.props.options
                ? cloneElement(input, {
                    ...input.props,
                    ...register(`${initialId}-${input.props.name}`),
                  })
                : cloneElement(input, {
                    ...input.props,
                    register: {
                      ...register(`${initialId}-${input.props.name}`),
                    },
                  })}
            </Fragment>
          ))}
          <Button
            onClick={(e) => handleCreate(e, initialId)}
            $variation="secondary"
          >
            <HiPlus />
          </Button>
        </InputsContainer>,
      ]);
      setInitializeInputContainers(false);
    }
  }, [
    initializeInputContainers,
    setInitializeInputContainers,
    colums,
    handleCreate,
    inputs,
    register,
  ]);

  return <InputsBox>{inputContainers}</InputsBox>;
};

export default DynamicInputsComponent;
