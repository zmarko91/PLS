import React, { useState, useEffect } from "react";
import BodyPart from "../components/BodyPartsBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";

/**
 * Component for managing and displaying body parts on the back side of a patient.
 */
const Component = () => {
    // State to manage the state of body parts (clicked or not clicked)
    const [bodyParts, setBodyParts] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const staticPatientId = location.state?.patientId;
    const { token } = useStateContext();
    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Handles a body part click event and sends an API request to update the state.
     * @param {string} id - The ID of the clicked body part.
     * @param {boolean} isClicked - The clicked state of the body part.
     */
    const handleBodyPartClick = async (id, isClicked) => {
        setBodyParts({ ...bodyParts, [id]: isClicked });

        // Make an API request to save the clicked body part immediately
        try {
            const response = await fetch("/api/save-body-part", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idpatient: staticPatientId,
                    bodyPartId: id,
                    isClicked,
                }),
            });

            if (response.ok) {
                console.log(
                    `Body part ${id} saved successfully for patient ${staticPatientId}!`
                );
            } else {
                console.error(
                    `Failed to save body part ${id} for patient ${staticPatientId}`
                );
            }
        } catch (error) {
            console.error(
                `Error while saving body part ${id} for patient ${staticPatientId}`,
                error
            );
        }
    };

    /**
     * Fetches the initial state of body parts for the patient from the API.
     */
    const fetchInitialBodyParts = async () => {
        try {
            const response = await fetch(
                `/api/get-body-parts?idpatient=${staticPatientId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const initialBodyParts = await response.json();
                console.log("Initial Body Parts:", initialBodyParts);
                setBodyParts(initialBodyParts || {}); // Ensure it defaults to an empty object if null or undefined
            } else {
                console.error(
                    `Failed to fetch initial body parts for patient ${staticPatientId}`
                );
            }
        } catch (error) {
            console.error(
                `Error while fetching initial body parts for patient ${staticPatientId}`,
                error
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch initial body parts when the component mounts
    useEffect(() => {
        fetchInitialBodyParts();
    }, []); // The empty dependency array ensures this effect runs once when the component mounts

    /**
     * Navigates to the front side of the body.
     */
    const goToShowBodyFront = () => {
        navigate("/ShowBodyFront");
    };

    return (
        <div className="bodyparts-container" style={{ paddingTop: "40px" }}>
            <h1>Back</h1>
            <svg
                className="body-svg"
                viewBox="0 0 103 202"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g className="first-layer">
                    {Object.entries(bodyParts).map(([part, clicked]) => (
                        <BodyPart
                            key={part}
                            id={part}
                            onClick={handleBodyPartClick}
                            initialClickedState={clicked || false}
                        />
                    ))}
                </g>
            </svg>
            <div>
                {/*        
        <h2>Clicked Body Parts</h2>
        <ul>
          {Object.entries(bodyParts).map(([part, clicked]) => (
            <li key={part}>{`${part}: ${clicked ? 'Clicked' : 'Not Clicked'}`}</li>
          ))}
        </ul>

        */}
            </div>

            <button onClick={goToShowBodyFront}>Go to Front</button>
        </div>
    );
};

export default Component;
