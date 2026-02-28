import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export const AddThemeColorModal = ({
    show,
    setShow,
    onSuccess,
    themeColors,
    setThemeColors,
    selectedColorForEdit,
    setSelectedColorForEdit
}: any) => {
    const [nameEn, setNameEn] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [color, setColor] = useState("#000000");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (selectedColorForEdit) {
            setNameEn(selectedColorForEdit.name || "");
            setNameAr(selectedColorForEdit.nameLa || "");
            setColor(selectedColorForEdit.hexCode || "#000000");
            setIsEditing(true);
        } else {
            setNameEn("");
            setNameAr("");
            setColor("#000000");
            setIsEditing(false);
        }
    }, [selectedColorForEdit]);

    const handleClose = () => {
        setShow(false);
        setSelectedColorForEdit(null);
        setNameEn("");
        setNameAr("");
        setColor("#000000");
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!nameEn.trim() || !nameAr.trim()) {
            toast.error("Please fill all required fields.");
            return;
        }

        if (!color) {
            toast.error("Please select a color.");
            return;
        }

        if (isEditing && selectedColorForEdit) {
            // Update existing color
            const updatedColor = {
                ...selectedColorForEdit,
                name: nameEn,
                nameLa: nameAr,
                hexCode: color,
            };

            const updatedColors = themeColors.map((c: any) =>
                c.hexCode === selectedColorForEdit.hexCode ? updatedColor : c
            );

            setThemeColors(updatedColors);
            onSuccess(updatedColor);
            toast.success("Theme color updated successfully.");
        } else {
            // Add new color
            const newColor = {
                name: nameEn,
                nameLa: nameAr,
                hexCode: color,
                isDefault: false
            };

            setThemeColors([...themeColors, newColor]);
            onSuccess(newColor);
            toast.success("Theme color added successfully.");
        }

        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditing ? "Edit Theme Color" : "+ Add New Theme Color"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    placeholder="Color Name (English)"
                    className="form-control mb-3"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                />
                <input
                    placeholder="Color Name (Arabic)"
                    className="form-control mb-3"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                />
                <input
                    type="color"
                    className="form-control mb-3"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>
                    {isEditing ? "Update" : "Save"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
