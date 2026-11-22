const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Get Users
export const GetUsers = async (token: string) => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};

// Update user role
export const UpdateRole = async (
  id: string,
  data: { role: string },
  token: string,
) => {
  const res = await fetch(`${BASE_URL}/users/update-role/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ role: data.role }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  return result;
};
