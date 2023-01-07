"use client";

import { Box, Button, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import AddForm from './add-form';
import IdeaCard from './idea-card';

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState(() => {
    let savedUser = localStorage.getItem("user");

    if (!savedUser) {
      const fetchNewUser = async () => {
        const response = await fetch('http://localhost:3000/api/identifier')
        const json = await response.json();
        savedUser = json
        localStorage.setItem("user", savedUser);
      }
      fetchNewUser()
    }

    return savedUser
  });

  const queryClient = useQueryClient();

  // Delete
  const deleteIdea = useMutation(async (index) => {
    await fetch(`http://localhost:3000/api/${user}/ideas`,
      {
        method: "DELETE",
        body: JSON.stringify({ index })
      });
  })
  function handleDelete(index) {
    deleteIdea.mutate(index, { onSuccess: () => queryClient.invalidateQueries(["ideas"]) })
  }

  // Add
  const addIdea = useMutation(async (idea) => {
    await fetch(`http://localhost:3000/api/${user}/ideas`,
      {
        method: "POST",
        body: JSON.stringify(idea)
      });
  })
  function handleAdd(idea) {
    addIdea.mutate(idea, { onSuccess: () => queryClient.invalidateQueries(["ideas"]) })
  }

  const query = useQuery(
    ["ideas", user],
    () => fetcher(`http://localhost:3000/api/${user}/ideas`),
    {
      suspense: true,
      retry: false,
    }
  );

  return (
    <Box sx={{ bgcolor: '#cfe8fc', height: "100vh", paddingTop: 5 }}>
      <Box sx={{ width: '60%', margin: '0 auto' }}>
        {showForm ?
          <AddForm setShowFn={setShowForm} addFn={handleAdd} />
          :
          <Box>
            <Button
              variant="contained"
              sx={{ marginBottom: "2rem" }}
              onClick={() => setShowForm(true)}
            >
              New Idea
            </Button>
            {query.data.ideas &&
              <Stack spacing={2}>
                {query.data.ideas.map((idea, index) => (
                  <IdeaCard key={index} idea={idea} deleteFn={() => handleDelete(index)} />
                ))}
              </Stack>
            }
          </Box>
        }
      </Box>
    </Box>
  )
}

const fetcher = async (...args) => {
  const response = await fetch(...args)
  if (!response.ok) {
    console.log(Error(response.status))
  }
  return await response.json()
};