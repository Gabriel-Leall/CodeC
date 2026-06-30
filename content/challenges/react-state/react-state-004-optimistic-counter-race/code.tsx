import React, { useState } from "react";

export function LikeCounter() {
  const [likes, setLikes] = useState(0);

  async function handleLike() {
    setLikes(likes + 1);
    await saveLike();
  }

  return (
    <button onClick={handleLike}>
      Likes: {likes}
    </button>
  );
}
