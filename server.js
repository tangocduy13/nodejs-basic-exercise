
async function getData() {
  const [users, posts, comments] = await Promise.all([
    (await fetch("https://jsonplaceholder.typicode.com/users")).json(),
    (await fetch("https://jsonplaceholder.typicode.com/posts")).json(),
    (await fetch("https://jsonplaceholder.typicode.com/comments")).json(),
  ]);
  return [users, posts, comments];
}

// 3. function hiển thị tất cả thông tin của user post và comment
//prepareData
const mapData = async () => {
  const [users, posts, comments] = await getData();
  const mappedUsers = users.map((user) => {
    const userPosts = posts
      .filter((post) => post.userId === user.id)
      .map(({ id, title, body }) => ({ id, title, body }));
    const userComments = comments.filter(
      (comment) => comment.email === user.email
    );
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      comments: userComments,
      posts: userPosts,
    };
  });

  return mappedUsers;
};

// 4. function hiển thị user có từ nhiều hơn 3 comments
const filterUserWithMoreThan3Comments = async () => {
  const mappedUsers = await mapData();
  const filteredUsers = mappedUsers.filter((user) => user.comments.length > 3);
  console.dir(filteredUsers, { depth: 5 });
};

// 5. hiển thị user cùng với số comments và số post
const userCount = async () => {
  const mappedUsers = await mapData();
  const users = mappedUsers.map((user) => {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      postCount: user.posts.length,
      commentCount: user.comments.length,
    };
  });
  return users;
};

// 6. Hiển thị user với số comments và post nhiều nhất
const findUserWithMostCommentsOrPosts = async () => {
  let userWithMostComments = null;
  let maxCommentsCount = -1;

  let userWithMostPosts = null;
  let maxPostsCount = -1;

  const mappedUsers = await userCount();

  //todo dùng map hoặc reduce thử xem thế nào nhé dùng như này chưa ổn lắm 

  mappedUsers.forEach((user) => {
    if (user.commentCount > maxCommentsCount) {
      maxCommentsCount = user.commentCount;
      userWithMostComments = user;
    }
  });
  mappedUsers.forEach((user) => {
    if (user.postCount > maxPostsCount) {
      maxPostsCount = user.postCount;
      userWithMostPosts = user;
    }
  });
  console.log(
    `User has the most comments:${JSON.stringify(userWithMostComments)}`
  );
  console.log(`User has the most posts:${JSON.stringify(userWithMostPosts)}`);
};

// 7. Sắp xếp user list theo thứ tự post giảm dần
const usersListOrderByPostCountDesc = async () => {
  const mappedUsers = await userCount();

  mappedUsers.sort((a, b) => b.postCount - a.postCount);
  console.dir(mappedUsers, { depth: 5 });
};

// 8. merge post và comment tại postId = 1
const postInfor = async (postId) => {
  const [posts, comments] = await Promise.all([
    (
      await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    ).json(),
    (
      await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      )
    ).json(),
  ]);

  const postData = {
    ...posts,
    comments,
  };
  console.log(postData);
};

// CHẠY FUNCTION Ở ĐÂY

// 3. hiển thị tất cả thông tin của user post và comment
// (async () => {
//   const result = await mapData();
//   console.dir(result, { depth: 5 });
// })();

// 4. hiển thị user có từ nhiều hơn 3 comments
// filterUserWithMoreThan3Comments();

// 5. đếm số lượng post và comment của 1 user
// (async () => {
//   const result = await userCount();
//   console.log(result);
// })();

// 6. Tìm kiếm user có nhiều comments hoặc post nhất
// findUserWithMostCommentsOrPosts();

// 7. sort user list theo thứ tự postCount giảm dần
// usersListOrderByPostCountDesc();

// 8. merge post và comment tại postId = 1
// postInfor(1);
