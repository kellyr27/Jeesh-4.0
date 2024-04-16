import cv2
import numpy as np
import imageio

def enhance_wireframe(input_path, output_path, kernel_size=3):
    # Read the GIF
    gif = imageio.mimread(input_path)

    # Initialize an array to store frames
    frames = []

    # Process each frame
    for frame in gif:
        # Check the number of channels in the frame
        if frame.shape[2] > 3:
            # If there are more than three channels, only keep the first three
            frame = frame[:, :, :3]

        # Split the frame into color channels
        b, g, r = cv2.split(frame)
        # Apply dilation to each color channel
        kernel = np.ones((kernel_size, kernel_size), np.uint8)
        b = cv2.dilate(b, kernel, iterations=3)
        g = cv2.dilate(g, kernel, iterations=3)
        r = cv2.dilate(r, kernel, iterations=3)
        # Merge the color channels back together
        enhanced_frame = cv2.merge([b, g, r])
        frames.append(enhanced_frame)

    # Write the enhanced frames to a new GIF
    imageio.mimsave(output_path, frames)

# Example usage
input_path = "rotating_star.gif"
output_path = "output.gif"
enhance_wireframe(input_path, output_path, kernel_size=5)