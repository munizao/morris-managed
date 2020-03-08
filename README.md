# Morris Gig Management API Work In Progress

Morris dance is an English folk dance form, danced in flamboyant costumes with bells, sticks, and handkerchiefs. The purpose of this project is to create a JSON API for organizing Morris performances. I am using Express to build HTTP routes in Node, and Mongoose over MongoDB for data modeling. Currently, there is no front-end for this API, but I hope to get to that soon!

The project contains the following models:

User: The API supports creating accounts and user authentication. Bcrypt is used to hash passwords, and JWT tokens stored in cookies are used to create persistent sessions. The user contains role information; the three roles are dancer, squire, (i.e. team leader) and admin. The User may be associated with a Dancer, which is described below.

Dancer: A dancer will have Competencies for various dances. A dancer may be on multiple teams. Not every Dancer needs to be associated with a User; though it will be beneficial for individual dancers to have their own accounts, a squire needs to be able to put Dancers into gigs and performances even if they don't have an account.

Competency: Data on how well a particular user knows how to dance a particular dance. Since different positions in a dance can be very different to execute, this is implemented with an array with length equal to the number of positions in a Dance.

Team: A Team has a number of Dancers, and a squire, which is a User authorized to make Gigs and other data that a team will need.

Dance: A Dance has figures (the segments that the dance is divided into, like the verses of a song) and a tradition, which affects performance details like the type of stepping or the way you flick your hankies, and is typically named after the village in England where that tradition originated.

DancePerformance: A DancePerformance has a dance and a list of Dancers in set positions.

Gig: A gig belongs to a single Team, and has some number of DancePerformances. In the real world, multiple-team gigs are common, but since most dances are danced separately, it isn't too useful to implement a multi-team Gig model.

Access to these models through CRUD (Create, Read, Update, Delete) routes has been implemented. Role based access control was set up using easy-rbac.

The anticipated flow of actions (once the front-end is written) is as follows: 

Someone will create an account, and then create a team, which they will initially be squire of. Then they will invite other members of their team to join up, and possibly add dancers to the db who don't. The squire will add dances to the team's repertoire by taking them from the public list, or by creating new ones. Dancers will input their competency information for the dances in their team's repertoire. 

When setting up a gig, the squire will select dances to add to the gig, then add dancers to those dances in positions they have marked themselves competent at.

At the gig itself, dancers will use a mobile-friendly site to remind themselves of which dances they are dancing, what their positions are, and what the figures of the dance are.


