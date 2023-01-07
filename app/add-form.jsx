import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    TextField,
    Typography
} from "@mui/material";

export default function AddForm({ setShowFn, addFn }) {
    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        addFn({ 'title': data.get('title'), 'description': data.get('description') })
        setShowFn(false)
    }

    return (
        <Card sx={{ border: "1px solid blue" }}>
            <CardContent>
                <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Typography gutterBottom variant="h6" component="div">
                        Add idea
                    </Typography>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => setShowFn(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        id="title"
                        name="title"
                        label="Title"
                        variant="outlined"
                        size="small"
                        fullWidth
                        required
                    />
                    <TextField
                        id="description"
                        name="description"
                        label="Description"
                        variant="outlined"
                        size="small"
                        fullWidth multiline rows={5}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Save
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}