# Image Searcher – Facial Clustering App

A desktop app that lets you query a large collection of photos by person.
Built to solve a real problem: finding yourself in 3000 wedding photos(and more) without having to back them up in google photos or something.

## Demo
https://github.com/user-attachments/assets/8cd94ff3-3104-497f-bdd1-14ab6261ab45

## What it does
- Find all photos containing a specific person
- Get solo photos vs group photos
- Query by combinations of people

The entire clustering process is unsupervised — no manual labelling required.

## How it works
1. Face detection using YOLO + DeepFace
2. Facial embeddings via CNN
3. Unsupervised clustering with HDBSCAN
4. Graph mapping between images and unique faces
5. Query the graph through the UI

## Tech Stack
**Frontend:** Electron.js, ReactJS, TypeScript, Tailwind CSS
**Backend:** Python, FastAPI
**ML:** YOLO, DeepFace, HDBSCAN, scikit-learn

## Setup

1. `pip install -r requirements.txt`
2. `npm install`

## Note
This was a personal project built in 2024. 
The demo video shows the working application.
Setup instructions may require minor adjustments.
