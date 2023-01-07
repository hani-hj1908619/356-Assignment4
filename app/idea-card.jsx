"use client";

import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Card,
    CardContent,
    IconButton,
    Typography
} from "@mui/material";

export default function IdeaCard({ idea, deleteFn }) {
    return (
        <Card sx={{ border: "1px solid blue" }}>
            <CardContent>
                <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Typography gutterBottom variant="h6" component="div">
                        {idea.title}
                    </Typography>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={deleteFn}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>

                <Typography gutterBottom variant="h7" component="div">
                    {idea.description}
                </Typography>
            </CardContent>
        </Card>
    )
}