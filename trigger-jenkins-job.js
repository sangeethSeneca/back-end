const jenkinsUrl = "http://localhost:8080";
const username = "sangeeth-22";
const password = "xxxxx";

// Function to fetch the crumb and session cookie
async function fetchCrumbAndCookie() {
  const { default: fetch } = await import("node-fetch");
  try {
    const crumbResponse = await fetch(`${jenkinsUrl}/crumbIssuer/api/json`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
          "base64"
        )}`,
      },
    });

    if (!crumbResponse.ok) {
      throw new Error(
        `Failed to fetch Jenkins crumb (Status: ${crumbResponse.status} ${crumbResponse.statusText})`
      );
    }

    // Extract the crumb token from the response
    const crumbData = await crumbResponse.json();
    const crumb = crumbData.crumb;

    // Extract the session cookie from the Set-Cookie header
    const sessionCookie = crumbResponse.headers.get("set-cookie");

    return { crumb, sessionCookie };
  } catch (error) {
    throw new Error("Error fetching Jenkins crumb and session cookie:", error);
  }
}

// Function to make the POST request with crumb and session cookie
async function makePostRequest() {
  const { default: fetch } = await import("node-fetch");

  try {
    const { crumb, sessionCookie } = await fetchCrumbAndCookie();

    const headers = {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
        "base64"
      )}`,
      "Jenkins-Crumb": crumb,
      Cookie: sessionCookie,
      "Content-Type": "application/x-www-form-urlencoded", // Set appropriate Content-Type if needed
    };

    const body = "your-post-data-here"; // Include the data you want to POST

    const response = await fetch(
      `${jenkinsUrl}/job/jest-test/build?token=1234`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${username}:${password}`
          ).toString("base64")}`,
          "Jenkins-Crumb": crumb,
          Cookie: sessionCookie,
          "Content-Type": "application/x-www-form-urlencoded", // Set appropriate Content-Type if needed
        },
      }
    );
  } catch (error) {
    console.error("Error making POST request:", error);
  }
}

// Call the function to make the POST request
makePostRequest();
