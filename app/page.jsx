"use client";

import { Box, Button, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import AddForm from 'app/add-form';
import IdeaCard from 'app/idea-card';
import { useIdeaStore } from 'stores/store';

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [ideas, setIdeas] = useState([])
  const user = useIdeaStore((state) => state.user);
  const setUser = useIdeaStore((state) => state.setUser);

  useEffect(() => {
    async function fetchNewUser() {
      const res = await fetch('/api/identifier')
      const newUser = await res.json()
      console.log(newUser);
      setUser(newUser)
    }

    if (!user) fetchNewUser()
  }, [])

  const query = useQuery(
    ["ideas", user],
    async () => await fetcher(`/api/${user}/ideas`),
    { retry: false }
  );

  useEffect(() => {
    if (query.isSuccess) setIdeas(query.data.ideas);
  }, [query]);

  // Mutations
  const queryClient = useQueryClient();

  // Delete
  const deleteIdea = useMutation(async (index) => {
    await fetch(`/api/${user}/ideas`,
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
    await fetch(`/api/${user}/ideas`,
      {
        method: "POST",
        body: JSON.stringify(idea)
      });
  })
  function handleAdd(idea) {
    addIdea.mutate(idea, { onSuccess: () => queryClient.invalidateQueries(["ideas"]) })
  }

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

            <Stack spacing={2}>
              {ideas.map((idea, index) => (
                <IdeaCard key={index} idea={idea} deleteFn={() => handleDelete(index)} />
              ))}
            </Stack>

          </Box>
        }
      </Box>
    </Box>
  )
}

const fetcher = async (...args) => {
  const response = await fetch(...args)
  if (!response.ok) {
    throw new Error(response.status)
  }
  return await response.json()
};