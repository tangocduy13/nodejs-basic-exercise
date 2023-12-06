// fetch data api
const fetchData = async (path) => {
  try {
    const data = await fetch(`https://jsonplaceholder.typicode.com${path}`);
    return data.json();
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  try {
    const [users, posts, comments] = await Promise.all([
      fetchData("/users"),
      fetchData("/posts"),
      fetchData("/comments"),
    ]);
    // 3. function hiển thị tất cả thông tin của user post và comment
    // prepare data
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

    console.dir(mappedUsers, { depth: 5 });

    // 4. function hiển thị user có từ nhiều hơn 3 comments
    const filteredUsers = mappedUsers.filter(
      (user) => user.comments.length > 3
    );
    console.dir(filteredUsers, { depth: 5 });

    // 5. hiển thị user cùng với số comments và số post
    const usersPostAndComments = mappedUsers.map((user) => {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        postCount: user.posts.length,
        commentCount: user.comments.length,
      };
    });
    console.log(usersPostAndComments);

    // 6. Hiển thị user với số comments và post nhiều nhất
    const userWithMostComments = usersPostAndComments.reduce(
      (prevUser, currentUser) => {
        return currentUser.commentCount > prevUser.commentCount
          ? currentUser
          : prevUser;
      }
    );
    console.log(userWithMostComments);

    const userWithMostPosts = usersPostAndComments.reduce(
      (prevUser, currentUser) => {
        return currentUser.postCount > prevUser.postCount
          ? currentUser
          : prevUser;
      }
    );
    console.log(userWithMostPosts);

    // 7. Sắp xếp user list theo thứ tự post giảm dần
    usersPostAndComments.sort((a, b) => b.postCount - a.postCount);
    console.dir(usersPostAndComments, { depth: 5 });
    console.log('===cau 8===')
    // 8. Hiển thị post và comment tại postid = 1
    const [post, comment] = await Promise.all([
      fetchData("/posts/1"),
      fetchData("/comments?postId=1")
    ]);

    const postData = {
      ...post,
      comment,
    };
    console.log(postData);
  } catch (error) {
    console.log(error);
  }
})();
