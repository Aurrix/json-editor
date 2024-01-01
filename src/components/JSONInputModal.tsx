import {Box, Modal, TextareaAutosize, Typography} from "@mui/material";

export default function JSONInputModal() {
    const open = false;
    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                </Typography>
                <TextareaAutosize placeholder={'Paste JSON here'}></TextareaAutosize>
            </Box>
        </Modal>
    )
}