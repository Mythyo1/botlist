/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Header from '../components/Header';
import Entry from '../components/Entry';
import Markdown from 'react-showdown';

export default class Edit extends React.Component{

    constructor(props){
        super(props);
        this.state = { content: '### Write something in long description' };
        if(!window.token) window.location.href = '/#/';
    }

    componentWillMount(){
        const inputs = {};

        fetch(`https://botlistapi.decimaldev.xyz/bot/${this.props.id}`)
        .then(res => res.json())
        .then(bot => {
            if(bot.message == 'not found'){
                window.location.href = '/#/';
                return;
            }else{
                ['id', 'prefix', 'perms', 'sserver', 'website', 'other-devs', 'tags', 'short-des', 'long-des'].forEach(x => {
                    inputs[x] = document.getElementById(x);
                });

                inputs.id.value = this.props.id;
                inputs.prefix.value = bot.prefix;
                inputs.perms.value = bot.perms;
                inputs.sserver.value = bot.support || '';
                inputs.website.value = bot.website || '';
                inputs.tags.value = bot.tags.join(', ');
                inputs['short-des'].value = bot.description.short || '';
                inputs['long-des'].value = bot.description.long || '';
            }
        });
    }

    submit(){
        const inputs = {};

        ['id', 'prefix', 'perms', 'sserver', 'website', 'other-devs', 'tags', 'short-des', 'long-des'].forEach(x => {
            inputs[x] = document.getElementById(x).value;
        });

        if(!inputs.id) return alert('Client id field is missing!');
        if(!inputs.prefix) return alert('Prefix is missing!');
        if(!inputs['short-des']) return alert('Short description field is missing!');

        let devs = inputs['other-devs'].split(', ');
        if(devs.length > 3) return alert('Other developers fields must have only 3 or less id only!');

        const data = {
            token: window.token,
            id: inputs.id,
            developers: devs.filter(Boolean),
            perms: inputs.perms,
            prefix: inputs.prefix,
            website: inputs.website,
            support: inputs.sserver,
            tags: inputs.tags.split(',').filter(Boolean),
            description: {
                short: inputs['short-des'],
                long: inputs['long-des']
            }
        };

        fetch('https://botlistapi.decimaldev.xyz/edit', { headers: { data: JSON.stringify(encodeURIComponent(data)) } })
        .then(res => res.json(), window.alertError)
        .then(data => {
            if(data.message == 'OK'){
                alert('Successfully edited!');
                window.location.href = `/#/bot/${inputs.id}`;
            }
            else if(data.message == 'user not in guild') {
                alert('You have not joined our server! You will be redirected to the server invite to join our server. After joining our server, try to submit the bot. This is just for verification!');
                window.location.href = 'https://discord.gg/FrduEZd';
            }
            else if(data.message == 'bot not exists') return alert('Bot does not exists on the bot list database!');
            else if(data.message == 'invalid owner') return alert('You are not the owner of the bot!');
            else if(data.message == 'invalid bot') return alert('Invalid client id provided!');
            else if(data.message == 'provided bot is not a bot') return alert('Provided client id is not a bot');
            else if(data.message == 'one of dev is invalid') return alert('One of the id provided in other developers is invalid!');
            else if(data.message == 'failed') return window.alertError();
            else if(data.message == 'invalid user') return alert('This bot does not belongs to you!');
        }, window.alertError)
        
    }

    render(){
        return <>
            <Header/>

            <div className="coverpage">
                <h1>Edit</h1>
            </div>

            <div style={{ padding: '30px' }}>
                <table style={{ width: '100%' }} className="new-box">
                    <Entry name="Client Id" id="id" info="Your bot's client id!" placeholder="0123456789"/>
                    <Entry name="Prefix" id="prefix" info="Your bot's prefix" placeholder="!"/>
                    <Entry name="Permissions" id="perms" info="Your bot's required permission interger!" placeholder="8"/>
                    <Entry name="Support Server" id="sserver" info="Invite of bot's support server!" placeholder="https://discord.gg/invite"/>
                    <Entry name="Website" id="website" info="Url of the bot's official website!" placeholder="https://example.com"/>
                    <Entry name="Other Developers" id="other-devs" info="The other developers of yout bot in id seperated with commas! Max: 2" placeholder="0123456789, 9876543210"/>
                    <Entry name="Tags" id="tags" info="Tags which describes your bot seperate with commas. This will help users to find your bot!" placeholder="fun, music, developer"/>
                    <Entry name="Short Description" id="short-des" info="The short description of your bot!" placeholder="An awesome bot with 8ball command!"/>
                    <tr className="entry" style={{ width: '100%' }}>
                        <td className="new-bot-entry-label">
                            <h3 style={{ fontWeight: 'bolder' }}>Long Description:</h3>
                            <p>Long description of your bot! Supports markdown too...</p>
                        </td>
                        <td className="new-bot-entry-cover">
                            <textarea id="long-des" onKeyPress={() => this.setState({ content: document.getElementById('long-des').value })} placeholder="Something brief about yout bot!"/>
                        </td>
                    </tr>
                    <tr className="entry" style={{ width: '100%' }}>
                        <td className="new-bot-entry-label">
                            <h3 style={{ fontWeight: 'bolder' }}>Output:</h3>
                            <p>Markdown output from long description...</p>
                        </td>
                        <td className="new-bot-entry-cover">
                            <Markdown markdown={this.state.content}/>
                        </td>
                    </tr>
                </table>

                <a onClick={this.submit.bind(this)} className="login-btn" style={{ width: '100%' }}>Edit</a>
            </div>
        </>;
    }

};
