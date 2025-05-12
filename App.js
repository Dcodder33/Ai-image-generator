const generateForm = document.querySelector(".generate-form");
const ImageGallery = document.querySelector(".image-gallery");

const CLIPDROP_API_KEY = "api key"; // Replace this with your actual key

async function generateAiImages(userPrompt, userImageQuantity) {
    const formData = new FormData();
    formData.append("prompt", userPrompt);

    const requests = Array.from({ length: userImageQuantity }, () =>
        fetch("https://clipdrop-api.co/text-to-image/v1", {
            method: "POST",
            headers: {
                "x-api-key": CLIPDROP_API_KEY
            },
            body: formData
        }).then(res => res.blob())
    );

    try {
        const images = await Promise.all(requests);

        images.forEach((blob, index) => {
            const imageUrl = URL.createObjectURL(blob);
            const imgCard = ImageGallery.querySelectorAll(".img-card")[index];
            const imgElement = imgCard.querySelector("img");
            const downloadBtn = imgCard.querySelector(".download-btn");

            imgElement.src = imageUrl;
            imgElement.onload = () => {
                imgCard.classList.remove("loading");
                downloadBtn.setAttribute("href", imageUrl);
                downloadBtn.setAttribute("download", `${userPrompt}-${index + 1}.png`);
            };
        });
    } catch (error) {
        alert("Failed to generate image: " + error.message);
    }
}

generateForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const userPrompt = event.srcElement[0].value;
    const userImageQuantity = parseInt(event.srcElement[1].value);

    const imgCardMarkup = Array.from({ length: userImageQuantity }, () => {
        return `
            <div class="img-card loading">
                <img decoding="async" src="images/loader.svg" alt="loading">
                <a href="#" class="download-btn">
                    <img decoding="async" src="images/download.svg" alt="download">
                </a>
            </div>`;
    }).join("");

    ImageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImageQuantity);
});
